import {spawn} from "threads";
import SessionWorker from "VMPL_BugReplay/js/lib/session-worker";

export default class RecorderManager {
    protected constructor(protected readonly sessionWorker: SessionWorker) {
    }

    sayHello() {
        this.sessionWorker.sayHello();
    }

    static init(instance: string = 'BugReplay'): Promise<RecorderManager> {
        return spawn(new Worker('./session-worker'))
            .then((sessionWorker: SessionWorker) => {
                return sessionWorker.initInstance(instance)
                    .then(() => new RecorderManager((sessionWorker)))
            })
    }
}
