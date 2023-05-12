import {IRecordEvent, RecordSession, SessionWorker} from "VMPL_BugReplay/js/api/session";
import {ConfigWorkerContent} from "VMPL_BugReplay/js/api/response";
import ItemPaginator from "VMPL_BugReplay/js/lib/items-paginator";
import {IPaginatorFilter, IPaginatorLoader, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {WorkerClient} from "VMPL_BugReplay/js/lib/worker/client";

export default class RecorderManager implements IPaginatorLoader {
    stopRecord: Function;
    readonly paginator: ItemPaginator<RecordSession[], RecorderManager>;

    protected constructor(
        protected readonly sessionWorker: SessionWorker,
    ) {
        this.paginator = new ItemPaginator([], this);
    }

    startRecord() {
        ((self) => {
            self.stopRecord = rrweb.record({
                emit(event: IRecordEvent) {
                    self.sessionWorker.post(event);
                }
            })
        })(this);
    }

    static init(instance: string = 'BugReplay'): Promise<RecorderManager> {
        return fetch('/vmpl-bug-report/config/worker')
            .then(response => response.json())
            .then((content: ConfigWorkerContent) => WorkerClient<SessionWorker>(content.assetUrl.sessionLoader))
            .then((sessionWorker: SessionWorker) => {
                return sessionWorker.initInstance(instance)
                    .then(() => new RecorderManager(sessionWorker))
            })
    }

    loadPaginatorItems(offset: number, limit: number, filter: IPaginatorFilter): Promise<IPaginatorResponse> {
        return this.sessionWorker.sessions(offset, limit, filter)
            .then(items => {
                items.items = items.items.map((it: any) => {
                    return {
                        timestamp: new Date(it.timestamp),
                        href: new URL(it.href),
                        title: it.title,
                    }
                })
                return items;
            });
    }
}
