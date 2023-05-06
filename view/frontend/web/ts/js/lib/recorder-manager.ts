import {spawn} from "threads";
import {RecordEvent, SessionWorker} from "VMPL_BugReplay/js/api/session";
import {ConfigWorkerContent} from "VMPL_BugReplay/js/api/response";
import {record} from "rrweb";

export default class RecorderManager {
    stopRecord: Function;

    protected constructor(
        protected readonly sessionWorker: SessionWorker,
    ) {
    }

    startRecord() {
        ((self) => {
            self.stopRecord = record({
                emit(event: RecordEvent) {
                    self.sessionWorker.post(event);
                }
            })
        })(this);
    }

    static init(instance: string = 'BugReplay'): Promise<RecorderManager> {
        return fetch('/vmpl-bug-report/config/worker')
            .then(response => response.json())
            .then((content: ConfigWorkerContent) => spawn(new Worker(content.assetUrl.sessionLoader)))
            .then((sessionWorker: SessionWorker) => {
                return sessionWorker.initInstance(instance)
                    .then(() => new RecorderManager((sessionWorker)))
            })
    }
}
