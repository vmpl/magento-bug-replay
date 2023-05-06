import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";

class Runner {
    constructor(protected readonly manager: RecorderManager) {
    }

    execute(): void {
        this.manager.startRecord();
    }
}
const runner = RecorderManager.init()
    .then(manager => new Runner(manager));
export default runner;
