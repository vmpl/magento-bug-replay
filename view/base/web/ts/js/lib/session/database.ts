import {Dexie} from "dexie";
import {exportDB, importInto, ExportOptions, ImportOptions} from "dexie-export-import";
import {IErrorConsole, IRecordEvent, IRecordSession} from "VMPL_BugReplay/js/api/session";
import {RecordEvent} from "VMPL_BugReplay/js/lib/session/model/record-event";
import {RecordSession} from "VMPL_BugReplay/js/lib/session/model/record-session";
import ErrorConsole from "VMPL_BugReplay/js/lib/session/model/error-console";

export default class Database extends Dexie {
    sessions!: Dexie.Table<IRecordSession, number>;
    events!: Dexie.Table<IRecordEvent, number>;
    buffer!: Dexie.Table<IRecordEvent, number>;
    errors!: Dexie.Table<IErrorConsole, string>;

    constructor(databaseName: string) {
        super(databaseName);
        this.initial();
        this.sessions.mapToClass(RecordSession);
        this.events.mapToClass(RecordEvent);
        this.buffer.mapToClass(RecordEvent);
        this.errors.mapToClass(ErrorConsole);
    }

    export(options?: ExportOptions): Promise<Blob> {
        return exportDB(this, options);
    }

    import(blob: Blob, options?: ImportOptions): Promise<void> {
        return importInto(this, blob, options);
    }

    private initial() {
        this.version(1).stores({
            sessions: '++id,&timestamp,href,title,*uploaded',
            events: '&timestamp,*type,data,sessionId',
            buffer: '&timestamp,*type,data',
            errors: '++id,&digest,message',
            sessionError: '[sessionId+errorId],*sessionId,*errorId',
        })
    }
}
