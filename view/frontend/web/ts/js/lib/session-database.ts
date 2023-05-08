import {Dexie} from "dexie";
import {EventType, RecordEvent} from "VMPL_BugReplay/js/api/session";

export default class SessionDatabase extends Dexie {
    events!: Dexie.Table<RecordEvent, number>;

    constructor(databaseName: string) {
        super(databaseName);
        this.version(1).stores({
            events: 'timestamp,type,data',
        });
        this.version(2).stores({
            events: '&timestamp,*type,data',
        })
    }

    postRecord(record: RecordEvent): Promise<RecordEvent> {
        return this.events.add(record);
    }

    getFullSnapshotsWithMeta(): Promise<RecordEvent[]> {
        const types: number[] = Array.of(EventType.FullSnapshot.valueOf(), EventType.Meta.valueOf());
        return this.events
            .orderBy('timestamp').reverse()
            .filter((it: RecordEvent) => types.indexOf(it.type.valueOf()) !== -1)
            .toArray();
    }
}
