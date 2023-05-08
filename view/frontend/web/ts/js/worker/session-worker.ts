import {expose} from 'threads/worker';
import {
    EventType,
    RecordEvent,
    RecordSession,
    SessionWorker as SessionWorkerInterface,
    SnapshotWithMeta
} from 'VMPL_BugReplay/js/api/session'
import SessionDatabase from "VMPL_BugReplay/js/lib/session-database";

class SessionWorker implements SessionWorkerInterface {
    protected database: SessionDatabase;

    exportToObject(): Object {
        return {
            initInstance: this.initInstance.bind(this),
            post: this.post.bind(this),
            sessions: this.sessions.bind(this),
        }
    }

    initInstance(instance: string): Promise<any> {
        this.database = new SessionDatabase(instance);
        return Promise.resolve();
    }

    post(event: RecordEvent): Promise<boolean> {
        return this.database.postRecord(event)
            .then(() => true);
    }

    sessions(offset: number = 0, limit: number): Promise<any[]> {
        return this.database.getFullSnapshotsWithMeta()
            .then(items => {
                const sessions: any[] = [];
                items
                    .splice(offset * 2, limit * 2)
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

                        sessions.push({
                            timestamp: snapshotMeta.meta.timestamp,
                            href: snapshotMeta.meta.data.href,
                            title: tagMetaTitle?.attributes?.content ?? 'Unknown',
                        })
                    })

                return sessions;
            })
    }
}

const sessionWorker = new SessionWorker();
expose(sessionWorker.exportToObject());
