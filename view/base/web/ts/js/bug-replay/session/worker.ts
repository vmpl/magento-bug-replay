import {
    EventType,
    IRecordEvent, IRecordSession,
    SessionWorker as SessionWorkerInterface,
} from 'VMPL_BugReplay/js/api/session'
import SessionDatabase from "VMPL_BugReplay/js/bug-replay/session/database";
import {IPaginatorFilter, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {WorkerConsumer} from "VMPL_BugReplay/js/lib/worker/consumer";
import axios from "axios";
import {RecordSession} from "VMPL_BugReplay/js/bug-replay/session/model/record-session";
import {error} from "consoleLogger";
import ErrorConsole from "VMPL_BugReplay/js/bug-replay/session/model/error-console";

@WorkerConsumer()
class Worker implements SessionWorkerInterface {
    protected database: SessionDatabase;

    initInstance(instance: string): Promise<void> {
        this.database = new SessionDatabase(instance);
        return Promise.resolve();
    }

    post(event: IRecordEvent): Promise<number> {
        return (event.type <= 2
            ? this.flushBuffer()
            : Promise.resolve(0))
            .then(sessionId => {
                return this.database.buffer.put(event)
                    .then(() => sessionId);
            })
    }

    sessions(
        offset: number = 0,
        limit: number, filter: IPaginatorFilter<IRecordSession>
    ): Promise<IPaginatorResponse<RecordSession>> {
        return this.database.sessions
            .orderBy('timestamp')
            .reverse()
            .toArray()
            .then(filter.match.bind(filter))
            .then(sessions => {
                const count = sessions.length;
                return {
                    items: sessions.slice(offset, offset + limit).map(it => new RecordSession(
                        it.title,
                        it.href,
                        it.timestamp,
                        it.id,
                        it.uploaded,
                    )),
                    meta: {
                        totalRecords: count,
                    }
                }
            })
    }

    events(sessions: IRecordSession[]): Promise<IPaginatorResponse<IRecordEvent>> {
        const sessionsIds = sessions
            .map(it => it.id)
            .filter(it => Number.isInteger(it))

        return this.database.events
            .where('sessionId')
            .anyOf(sessionsIds)
            .toArray()
            .then(events => {
                return <IPaginatorResponse<IRecordEvent>>{
                    items: events,
                    meta: {
                        totalRecords: events.length,
                    }
                }
            })
    }

    export(sessions: IRecordSession[]): Promise<number[]> {
        const sessionIds = sessions
            .filter(it => it?.id && !it?.uploaded)
            .map(it => it.id);

        if (!sessionIds.length) {
            return Promise.resolve([]);
        }

        return this.database.export({
            filter: (table: string, value: any, key?: any): boolean => {
                switch (table) {
                    case 'sessions':
                        return sessionIds.includes((<IRecordSession>value).id);
                    case 'events':
                        return sessionIds.includes((<IRecordEvent>value).sessionId);
                    default:
                        return false;
                }
            },
        }).then(blob => {
            const body = new FormData();
            body.append('database', new File([blob], 'database.json'), 'database.json');
            return axios.post('/vmpl-bug-report/session/upload', body)
                .then(response => response.data);
        }).then(({fileName}) => {
            return Promise.all(
                sessionIds
                    .map(id => {
                        return this.database.sessions.update(id, {uploaded: fileName})
                    }),
            );
        })
    }

    import(url: string): Promise<void> {
        return axios.get(url, {responseType: 'blob'})
            .then(response => this.database.import(response.data, {acceptNameDiff: true}))
    }

    delete(sessions: IRecordSession[]): Promise<void> {
        const sessionIds = sessions.map(it => it.id).filter(it => !!it);

        const sessionError = this.database.table('sessionError');
        return this.database.transaction('rw', [
            this.database.events,
            this.database.sessions,
            this.database.errors,
            sessionError,
        ], () => {
            return sessionError.where('sessionId').anyOf(sessionIds).toArray()
                .then((items: {errorId: string}[]) => {
                    return Promise.all([
                        this.database.sessions.bulkDelete(sessionIds),
                        this.database.events
                            .where('sessionId')
                            .anyOf(sessionIds)
                            .delete(),
                        this.database.errors.bulkDelete(items.map(it => it.errorId)),
                        sessionError.where('sessionId').anyOf(sessionIds).delete(),
                    ])
                })
                .then()
        });
    }

    /**
     * @private
     * @return number when buffer has event with error in the console otherwise zero
     */
    private flushBuffer(): Promise<number> {
        return Promise.all([
            this.database.buffer.where('type').equals(EventType.Meta).first(),
            this.database.buffer.where('type').equals(EventType.FullSnapshot).first(),
            this.createBufferErrorDigests(),
        ]).then(([meta, snapshot, errorConsoles]) => {
            const tagMetaTitle = snapshot?.data.node
                .childNodes.find((it: any) => it?.tagName === 'html')
                .childNodes.find((it: any) => it?.tagName === 'head')
                .childNodes.find((it: any) => it?.attributes?.name === 'title')

            const sessionError = this.database.table('sessionError');
            return this.database.transaction('rw', [
                this.database.buffer,
                this.database.events,
                this.database.sessions,
                this.database.errors,
                sessionError,
            ], () => {
                return Promise.all([
                    this.database.sessions.put({
                        href: meta.data.href,
                        title: tagMetaTitle?.attributes?.content ?? 'Unknown',
                        timestamp: meta.timestamp,
                    }),
                    this.database.errors.bulkPut(errorConsoles.filter(it => !it.id), {allKeys: true}),
                ]).then(([sessionId, errorKeys]) => {
                    const errorIds =  errorKeys.map(it => ~~it);
                    errorIds.push(...errorConsoles.filter(it => !!it.id).map(it => it.id))

                    return Promise.all([
                        sessionError.bulkAdd(errorIds
                            .map(errorId => { return {sessionId, errorId} })),
                        this.database.buffer
                            .toArray()
                            .then(events => events.map(it => {
                                it.sessionId = sessionId;
                                return it;
                            }))
                            .then(events => this.database.events.bulkPut(events)),
                    ])
                        .then(() => this.database.buffer.clear())
                        .then(() => !errorConsoles.length ? 0 : sessionId);
                })
            })
        })
    }

    private createBufferErrorDigests(): Promise<ErrorConsole[]> {
        const textEncoder = new TextEncoder();
        const textDecoder = new TextDecoder();

        return this.database.buffer
            .where('type').equals(6)
            .and(it => {
                return it.data.plugin.startsWith('rrweb/console')
                    && it.data.payload.level === 'error';
            }).toArray()
                .then(errorEvents => Promise.all(errorEvents
                        .map(event => Promise.all([event,
                            crypto.subtle.digest('SHA-1', textEncoder.encode(JSON.stringify(event.data.payload)))])))
                )
                .then(results => {
                    const errorMap = new Map<string, IRecordEvent>();
                    results.forEach(([event, digest]) => {
                        errorMap.set(textDecoder.decode(digest), event)
                    });
                    return errorMap;
                })
                .then(digests => {
                    return this.database.errors.where('digest').anyOf(Array.from(digests.keys())).toArray()
                        .then(consoleErrors => {
                            digests.forEach((event, digest) => {
                                if (!consoleErrors.some(it => it.digest === digest)) {
                                    consoleErrors.push(new ErrorConsole(digest, event.data.payload.payload.shift()))
                                }
                            })
                            return consoleErrors;
                        })
                })
                .then(consoleErrors => {
                    return this.database.table('sessionError')
                        .where('errorId')
                        .anyOf(consoleErrors.map(it => it.id))
                        .toArray()
                        .then((items: {sessionId: number, errorId: number}[]) => {
                            return this.database.sessions
                                .where('id')
                                .anyOf(items.map(it => it.sessionId))
                                .and(it => !!(it.uploaded && it.uploaded.length))
                                .toArray()
                                .then(sessions => items
                                    .filter(it => sessions
                                        .some(session => session.id == it.sessionId))
                                            .map(it => it.errorId))
                        })
                        .then(items => consoleErrors.filter(it => !items.includes(it.id)))
                })
    }
}

(new Worker());
