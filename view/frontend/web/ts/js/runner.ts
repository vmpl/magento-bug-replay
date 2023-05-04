import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";

class Runner {
    constructor(private manager: RecorderManager) {
    }

    execute(): void {
        this.manager.logMessage();
    }
}
const runner = new Runner(new RecorderManager('Hello World!'));
export default runner;
