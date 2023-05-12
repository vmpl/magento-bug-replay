import {IRecordEvent, IRecordSession, SessionWorker} from "VMPL_BugReplay/js/api/session";
import {ConfigWorkerContent} from "VMPL_BugReplay/js/api/response";
import ItemPaginator from "VMPL_BugReplay/js/lib/items-paginator";
import {IPaginatorFilter, IPaginatorLoader, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {WorkerClient} from "VMPL_BugReplay/js/lib/worker/client";
import {RecordSession} from "VMPL_BugReplay/js/lib/session-models";

export default class RecorderManager implements IPaginatorLoader<IRecordSession> {
    readonly paginator: ItemPaginator<IRecordSession, RecorderManager>;
    stopRecord: Function;

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

    getEventsForSessionAt(sessions: IRecordSession[]): Promise<IRecordEvent[]> {
        return this.sessionWorker.events(sessions)
            .then(response => response.items);
    }

    loadPaginatorItems(
        offset: number,
        limit: number,
        filter: IPaginatorFilter<IRecordSession>,
    ): Promise<IPaginatorResponse<IRecordSession>> {
        return this.sessionWorker.sessions(offset, limit, filter)
            .then(items => {
                items.items = items.items.map(it => {
                    return new RecordSession(
                        new URL(it.href),
                        it.title,
                        new Date(it.timestamp)
                    );
                })
                return items;
            });
    }
}
