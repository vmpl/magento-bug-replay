import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";
import {PaginatorFilter} from "VMPL_BugReplay/js/lib/items-paginator";

class Runner {
    constructor(
        protected readonly manager: RecorderManager
    ) {
    }

    execute(): void {
        this.manager.startRecord();
        this.exposeDemoActions();
    }

    exposeDemoActions(): void {
        const range = (from: number, to: number) => {
            const range = [];
            for (let i = from; i < to; i++) {
                range.push(i);
            }
            return range;
        }

        // @ts-ignore
        window.demo = {
            getSessionRecords: async () => {
                for await (const session of this.manager.paginator) {
                    console.log(session);
                }
            },
            goForPage: (value: number) => (this.manager.paginator.page = value),
            addFilterWithTitle: (title: string = 'Jackets - Tops - Women') => {
                this.manager.paginator.filter = new PaginatorFilter('title', title);
            },
            getTwoFirstSessionEvents: (from: number = 0, to: number = 2) => {
                Promise.all(range(from, to).map(it => this.manager.paginator.fetch(it)))
                    .then(sessions => this.manager.getEventsForSessionAt(sessions))
                    .then(events => console.log(events))
            },
            uploadSessions: () => {
                this.manager.uploadSessions()
                    .then(() => console.log('finished'));
            },
            deleteFirstSession: () => {
                this.manager.deleteSession(0)
                    .then(() => console.log('deleted'));
            },
            deleteAllSessions: () => {
                this.manager.deleteSession()
                    .then(() => console.log('deletedAll'));
            }
        }
    }
}
const runner = RecorderManager.init()
    .then(manager => new Runner(manager));
export default runner;
