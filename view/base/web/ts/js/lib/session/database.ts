import {Dexie} from "dexie";
import {exportDB, importInto, ExportOptions, ImportOptions} from "dexie-export-import";
import relationships from "dexie-relationships";
import {IRecordEvent, IRecordSession} from "VMPL_BugReplay/js/api/session";
import {RecordEvent} from "VMPL_BugReplay/js/lib/session/model/record-event";
import {RecordSession} from "VMPL_BugReplay/js/lib/session/model/record-session";

export default class Database extends Dexie {
    sessions!: Dexie.Table<IRecordSession, number>;
    events!: Dexie.Table<IRecordEvent, number>;
    buffer!: Dexie.Table<IRecordEvent, number>;

    constructor(databaseName: string) {
        super(databaseName, {addons: [relationships]});
        this.initial();
        this.addingUploadFlag();
        this.sessions.mapToClass(RecordSession);
        this.events.mapToClass(RecordEvent);
        this.buffer.mapToClass(RecordEvent);
    }

    export(options?: ExportOptions): Promise<Blob> {
        return exportDB(this, options);
    }

    import(blob: Blob, options?: ImportOptions): Promise<void> {
        return importInto(this, blob, options);
    }

    private initial() {
        this.version(1).stores({
            sessions: '++id,&timestamp,href,title',
            events: '&timestamp,*type,data,sessionId -> sessions.id',
            buffer: '&timestamp,*type,data',
        });
    }

    private addingUploadFlag() {
        this.version(2).stores({
            sessions: '++id,&timestamp,href,title,*uploaded',
            events: '&timestamp,*type,data,sessionId -> sessions.id',
            buffer: '&timestamp,*type,data',
        });
    }
}
