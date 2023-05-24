import {WorkerArgument} from "VMPL_BugReplay/js/lib/worker/decorator";
import {IRecordEvent, IRecordSession} from "VMPL_BugReplay/js/api/session";
import module from "module";

@WorkerArgument(module.id)
export class RecordSession implements IRecordSession {
    get url(): URL {
        return new URL(this.href)
    }

    get date(): Date {
        return new Date(this.timestamp);
    }

    constructor(
        readonly title: string,
        readonly href: string,
        readonly timestamp: number,
        public id: number = null,
        public readonly uploaded?: string,
        public readonly events?: IRecordEvent[],
    ) {
    }
}

