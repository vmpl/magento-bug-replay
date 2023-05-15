import {WorkerArgument} from "VMPL_BugReplay/js/lib/worker/decorator";
import module from "module";
import {EventType, IRecordEvent, IRecordSession} from "VMPL_BugReplay/js/api/session";

@WorkerArgument(module.id)
export class RecordEvent implements IRecordEvent {
    constructor(
        public readonly timestamp: number,
        public readonly type: EventType,
        public readonly data: any,
        public readonly session?: IRecordSession,
    ) {
    }
}
