import {expose} from 'threads/worker';
import {Dexie} from 'dexie';
import {RecordEvent, SessionWorker as SessionWorkerInterface} from 'VMPL_BugReplay/js/api/session'

class SessionDatabase extends Dexie {
    events!: Dexie.Table<RecordEvent, number>;

    constructor(databaseName: string) {
        super(databaseName);
        this.version(1).stores({
            events: 'timestamp,type,data',
        });
    }

    postRecord(record: RecordEvent): Promise<RecordEvent> {
        return this.events.add(record);
    }
}

class SessionWorker implements SessionWorkerInterface {
    protected database: SessionDatabase;

    exportToObject(): Object {
        return {
            initInstance: this.initInstance.bind(this),
            post: this.post.bind(this),
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
}
const sessionWorker = new SessionWorker();

expose(sessionWorker.exportToObject());
