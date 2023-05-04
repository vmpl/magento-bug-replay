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

    post(record: RecordEvent): Promise<RecordEvent> {
        return this.events.put(record);
    }
}

class SessionWorker implements SessionWorkerInterface {
    protected database: Dexie;
    initInstance(instance: string): Promise<any> {
        this.database = new SessionDatabase(instance);
        return Promise.resolve();
    }
    sayHello(): Promise<any> {
        console.log('Hello World!');
        return Promise.resolve();
    }

    exportToObject(): Object {
        return {
            initInstance: this.initInstance.bind(this),
            sayHello: this.sayHello.bind(this),
        }
    }
}
const sessionWorker = new SessionWorker();

expose(sessionWorker.exportToObject());
