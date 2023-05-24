import {IRecordEvent, IRecordSession, SessionWorker} from "VMPL_BugReplay/js/api/session";
import {ConfigWorkerContent} from "VMPL_BugReplay/js/api/response";
import ItemPaginator from "VMPL_BugReplay/js/lib/items-paginator";
import {IPaginatorFilter, IPaginatorLoader, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {WorkerClient} from "VMPL_BugReplay/js/lib/worker/client";
declare const rrweb: {record: Function};

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

    uploadSessions(sessions: IRecordSession[]): Promise<void> {
        return this.sessionWorker.export(sessions)
            .then(() => this.paginator.clear())
    }

    async deleteSession(at: number): Promise<void> {
        return this.paginator.fetch(at)
            .then(session => this.sessionWorker.delete([session]))
            .then(() => this.paginator.clear());
    }

    loadPaginatorItems(
        offset: number,
        limit: number,
        filter: IPaginatorFilter<IRecordSession>,
    ): Promise<IPaginatorResponse<IRecordSession>> {
        return this.sessionWorker.sessions(offset, limit, filter);
    }
}
