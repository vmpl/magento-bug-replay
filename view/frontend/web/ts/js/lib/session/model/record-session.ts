import {WorkerArgument, WorkerSerializable} from "VMPL_BugReplay/js/lib/worker/decorator";
import module from "module";
import {IRecordSession} from "VMPL_BugReplay/js/api/session";

@WorkerArgument(module.id)
@WorkerSerializable({
    href: [(it: URL) => it.toString(), (it: string) => new URL(it)],
    timestamp: [(it: Date) => it.getTime(), (it: number) => new Date(it)],
})
export class RecordSession implements IRecordSession {
    constructor(
        public readonly href: URL,
        public readonly title: string,
        public readonly timestamp: Date,
    ) {
    }
}
