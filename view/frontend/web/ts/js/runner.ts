import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";

class Runner {
    constructor(protected readonly manager: RecorderManager) {
    }

    execute(): void {
        this.manager.startRecord();
        this.exposeDemoActions();
    }

    exposeDemoActions(): void {
        // @ts-ignore
        window.demo = {
            getSessionRecords: () => {
                this.manager.paginator.getCurrentPage()
                    .then(items => console.log(items));
            },
            goForPage: (value: number) => (this.manager.paginator.page = value),
        }
    }
}
const runner = RecorderManager.init()
    .then(manager => new Runner(manager));
export default runner;
