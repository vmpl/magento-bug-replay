import {Dexie} from "dexie";
import {exportDB} from "dexie-export-import";
import {EventType, IRecordEvent} from "VMPL_BugReplay/js/api/session";
import {RecordEvent} from "VMPL_BugReplay/js/lib/session/model/record-event";

export default class Database extends Dexie {
    events!: Dexie.Table<IRecordEvent, number>;

    constructor(databaseName: string) {
        super(databaseName);
        let counter: number = 0;
        this.version(++counter).stores({
            events: '&timestamp,*type,data',
        })
        this.events.mapToClass(RecordEvent);
    }

    postRecord(record: IRecordEvent): Promise<number> {
        return this.events.put(record);
    }

    getFullSnapshotsWithMeta(): Promise<IRecordEvent[]> {
        const types: number[] = Array.of(EventType.FullSnapshot.valueOf(), EventType.Meta.valueOf());
        return this.events
            .orderBy('timestamp').reverse()
            .filter(it => types.indexOf(it?.type.valueOf()) !== -1)
            .toArray();
    }

    getEvents(timestamp: number): Promise<IRecordEvent[]> {
        return this.events
            .orderBy('timestamp').reverse()
            .filter((it: IRecordEvent) => it?.type === EventType.Meta)
            .filter((it: IRecordEvent) => it?.timestamp > timestamp)
            .limit(1)
            .first()
            .then((nextSession?: IRecordEvent) => {
                return this.events
                    .orderBy('timestamp').reverse()
                    .filter((it: IRecordEvent) => it?.timestamp >= timestamp
                        && it?.timestamp < (nextSession?.timestamp ?? Number.MAX_VALUE))
                    .toArray()
            })
    }

    exportSessions(fromDate?: Date, toDate?: Date): Promise<Blob> {
        return exportDB(this, {
            filter: (table: string, value: any, key?: any): boolean => {
                switch (table) {
                    case 'events':
                        return (<IRecordEvent>value).timestamp >= (fromDate?.getTime() || Number.MIN_VALUE)
                            && (<IRecordEvent>value).timestamp <= (toDate?.getTime() || Number.MAX_VALUE);
                    default:
                        return false;
                }
            }
        });
    }
}
