import {
    EventType,
    IRecordEvent, IRecordSession,
    SessionWorker as SessionWorkerInterface,
} from 'VMPL_BugReplay/js/api/session'
import SessionDatabase from "VMPL_BugReplay/js/lib/session/database";
import {IPaginatorFilter, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {WorkerConsumer} from "VMPL_BugReplay/js/lib/worker/consumer";
import axios from "axios";
import {RecordSession} from "VMPL_BugReplay/js/lib/session/model/record-session";
import {error} from "consoleLogger";

@WorkerConsumer()
class Worker implements SessionWorkerInterface {
    protected database: SessionDatabase;

    initInstance(instance: string): Promise<void> {
        this.database = new SessionDatabase(instance);
        return Promise.resolve();
    }

    post(event: IRecordEvent): Promise<number> {
        return Promise.all([
            this.database.buffer.where('type').equals(EventType.Meta).count(),
            this.database.buffer.where('type').equals(EventType.FullSnapshot).count(),
        ])
            .then(([metaCount, snapshotCount]) => {
                return metaCount === snapshotCount && snapshotCount === 0
                    ? Promise.resolve(0)
                    : this.flushBuffer()
            })
            .then(sessionId => this.database.buffer.put(event)
                .then(() => sessionId)
                .catch(error => {
                throw error;
            }))
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
        return this.database.transaction('rw', [this.database.events, this.database.sessions], () => {
            return this.database.events
                .where('sessionId')
                .anyOf(sessionIds)
                .eachPrimaryKey(it => this.database.events.delete(it))
                .then(() => this.database.sessions.bulkDelete(sessionIds))
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
        ]).then(([meta, snapshot]) => {
            const tagMetaTitle = snapshot?.data.node
                .childNodes.find((it: any) => it?.tagName === 'html')
                .childNodes.find((it: any) => it?.tagName === 'head')
                .childNodes.find((it: any) => it?.attributes?.name === 'title')

            return this.database.transaction('rw', [this.database.buffer, this.database.events, this.database.sessions], () => {
                return this.database.sessions.put({
                    href: meta.data.href,
                    title: tagMetaTitle?.attributes?.content ?? 'Unknown',
                    timestamp: meta.timestamp,
                }).catch(error => {
                    throw error;
                }).then(sessionId => {
                    return this.database.buffer
                        .where('type').equals(6)
                        .and(it => {
                            return it.data.plugin.startsWith('rrweb/console')
                                && it.data.payload.level === 'error';
                        })
                        .first()
                        .then(errorEvent => {
                            return this.database.buffer
                                .toArray()
                                .then(events => events.map(it => {
                                    it.sessionId = sessionId;
                                    return it;
                                }))
                                .then(events => this.database.events.bulkPut(events))
                                .then(() => this.database.buffer.clear())
                                .then(() => errorEvent === undefined ? 0 : sessionId);
                        })
                })
            })
        })
    }
}

(new Worker());
