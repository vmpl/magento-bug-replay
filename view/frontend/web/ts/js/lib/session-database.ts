// @ts-ignore
import {Dexie} from "dexie";
import {EventType, IRecordEvent} from "VMPL_BugReplay/js/api/session";

export default class SessionDatabase extends Dexie {
    events!: Dexie.Table<IRecordEvent, number>;

    constructor(databaseName: string) {
        super(databaseName);
        super.version(1).stores({
            events: 'timestamp,type,data',
        });
        super.version(2).stores({
            events: '&timestamp,*type,data',
        })
    }

    postRecord(record: IRecordEvent): Promise<IRecordEvent> {
        return this.events.add(record);
    }

    getFullSnapshotsWithMeta(): Promise<IRecordEvent[]> {
        const types: number[] = Array.of(EventType.FullSnapshot.valueOf(), EventType.Meta.valueOf());
        return this.events
            .orderBy('timestamp').reverse()
            .filter((it: IRecordEvent) => types.indexOf(it.type.valueOf()) !== -1)
            .toArray();
    }
}
