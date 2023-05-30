import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";
import {PaginatorFilter} from "VMPL_BugReplay/js/lib/items-paginator";
import {IRecordSession} from "VMPL_BugReplay/js/api/session";

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
            startRecord: () => {
                this.manager.startRecord()
            },
            getSessionRecords: () => {
                this.manager.paginator.forEach((item) => {
                    console.log(item)
                });
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
                this.manager.paginator.all()
                    .then(sessions => {
                        return this.manager.uploadSessions(sessions);
                    })
                    .then(() => console.log('finished'));
            },
            deleteFirstSession: () => {
                this.manager.deleteAt(0)
                    .then(() => console.log('deleted'));
            },
            deleteAllSessions: () => {
                this.manager.paginator.forEach((item, index) => {
                    this.manager.deleteAt(index);
                })
                    .then(() => console.log('deletedAll'))
            }
        }
    }
}
const runner = RecorderManager.init()
    .then(manager => new Runner(manager));
export default runner;
