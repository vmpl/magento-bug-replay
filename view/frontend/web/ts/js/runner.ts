import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";

class Runner {
    constructor(private manager: RecorderManager) {
    }

    execute(): void {
        this.manager.sayHello();
    }
}
const runner = RecorderManager.init()
    .then(manager => new Runner(manager));
export default runner;
