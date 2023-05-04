import {expose} from "threads";
import Dexie from "dexie";

export interface RecordEvent {
    timestamp: number,
    type: number,
    data: Object,
}

class SessionDataBase extends Dexie {
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

export default class SessionWorker {
    protected database: Dexie;
    initInstance(instance: string): Promise<any> {
        this.database = new SessionDataBase(instance);
        return Promise.resolve();
    }
    sayHello(): Promise<any> {
        console.log('Hello World!');
        return Promise.resolve();
    }
}

expose(SessionWorker);
