import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";
import {PaginatorFilter} from "VMPL_BugReplay/js/lib/items-paginator";

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
            addFilterWithTitle: (title: string = 'Jackets - Tops - Women') => {
                this.manager.paginator.filter = new PaginatorFilter('title', title);
            },
            getTwoFirstSessionEvents: () => {
                this.manager.paginator.getCurrentPage()
                    .then(sessions => {
                        return this.manager.getEventsForSessionAt(sessions.slice(0, 2))
                    })
                    .then(events => console.log(events))
            }
        }
    }
}
const runner = RecorderManager.init()
    .then(manager => new Runner(manager));
export default runner;
