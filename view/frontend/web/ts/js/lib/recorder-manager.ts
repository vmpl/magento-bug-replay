import {spawn} from "threads";
import {SessionWorker} from "VMPL_BugReplay/js/api/session";
import {ConfigWorkerContent} from "VMPL_BugReplay/js/api/response";

export default class RecorderManager {
    protected constructor(protected readonly sessionWorker: SessionWorker) {
    }

    sayHello() {
        this.sessionWorker.sayHello();
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
