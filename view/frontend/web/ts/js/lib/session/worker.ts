import {
    EventType,
    IRecordEvent, IRecordSession,
    SessionWorker as SessionWorkerInterface,
    SnapshotWithMeta
} from 'VMPL_BugReplay/js/api/session'
import SessionDatabase from "VMPL_BugReplay/js/lib/session/database";
import {IPaginatorFilter, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {WorkerConsumer} from "VMPL_BugReplay/js/lib/worker/consumer";
import {RecordSession} from "VMPL_BugReplay/js/lib/session/models";

@WorkerConsumer()
class Worker implements SessionWorkerInterface {
    protected database: SessionDatabase;

    initInstance(instance: string): Promise<void> {
        this.database = new SessionDatabase(instance);
        return Promise.resolve();
    }

    post(event: IRecordEvent): Promise<boolean> {
        return this.database.postRecord(event)
            .then(() => true);
    }

    sessions(
        offset: number = 0,
        limit: number, filter: IPaginatorFilter<IRecordSession>
    ): Promise<IPaginatorResponse<IRecordSession>> {
        return this.database.getFullSnapshotsWithMeta()
            .then(items => {
                let sessions: any[] = [];
                items
                    .reduce<SnapshotWithMeta[]>((accumulator, currentValue) => {
                        let snapshotMeta: SnapshotWithMeta = accumulator.pop() ?? {snapshot: null, meta: null};
                        if (snapshotMeta.meta !== null && snapshotMeta.snapshot !== null) {
                            accumulator.push(snapshotMeta);
                            snapshotMeta = {snapshot: null, meta: null};
                        }

                        switch (true) {
                            case currentValue.type === EventType.Meta && snapshotMeta.meta === null:
                                snapshotMeta.meta = currentValue;
                                break;
                            case currentValue.type === EventType.FullSnapshot && snapshotMeta.snapshot === null:
                                snapshotMeta.snapshot = currentValue;
                                break;
                            default:
                                break;
                        }

                        accumulator.push(snapshotMeta);
                        return accumulator;
                    }, [])
                    .filter(it => !(it.meta === null || it.snapshot === null))
                    .forEach((snapshotMeta: SnapshotWithMeta) => {
                        const tagMetaTitle = snapshotMeta.snapshot.data.node
                            .childNodes.find((it: any) => it.tagName === 'html')
                            .childNodes.find((it: any) => it.tagName === 'head')
                            .childNodes.find((it: any) => it.attributes?.name === 'title')

                        sessions.push(new RecordSession(
                            new URL(snapshotMeta.meta.data.href),
                            tagMetaTitle?.attributes?.content ?? 'Unknown',
                            new Date(snapshotMeta.meta.timestamp),
                        ))
                    })

                sessions = filter?.match(sessions) ?? sessions;
                return {
                    meta: {totalRecords: sessions.length},
                    items: sessions.slice(offset, limit)
                }
            })
    }

    events(sessions: IRecordSession[]): Promise<IPaginatorResponse<IRecordEvent>> {
        return Promise.all(sessions.map(session => this.database.getEvents(session.timestamp.getTime())))
            .then(events => {
                const items = <IRecordEvent[]>[].concat(...events);
                // @ts-ignore
                items.sort((a, b) => a.timestamp > b.timestamp)
                return {
                    items: items,
                    meta: {
                        totalRecords: items.length,
                    }
                }
            })
    }
}

(new Worker());
