import {WorkerArgument, WorkerSerializable} from "VMPL_BugReplay/js/lib/worker/decorator";
import module from "module";
import {EventType, IRecordEvent} from "VMPL_BugReplay/js/api/session";

@WorkerArgument(module.id)
@WorkerSerializable({
    type: [(it: EventType) => it.valueOf(), (it: number) => EventType[it]],
})
export class RecordEvent implements IRecordEvent {
    constructor(
        public readonly timestamp: number,
        public readonly type: EventType,
        public readonly data: any,
    ) {
    }
}
