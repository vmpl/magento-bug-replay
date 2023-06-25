import {IRecordEvent, IRecordSession, SessionWorker} from "VMPL_BugReplay/js/api/session";
import ItemPaginator, {PaginatorFilter} from "VMPL_BugReplay/js/bug-replay/items-paginator";
import {IPaginatorFilter, IPaginatorLoader, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {WorkerClient} from "VMPL_BugReplay/js/lib/worker/client";
import {RecordSession} from "VMPL_BugReplay/js/bug-replay/session/model/record-session";
import {eventWithTime, recordOptions, RecordPlugin} from "rrweb/typings/types";

declare const rrweb: {record: (options: recordOptions<eventWithTime>) => Function, getRecordConsolePlugin: () => RecordPlugin };

export class DataEvent extends Event {
    data: any;

    static get Types() {
        return  {
            NewSessionWithError: 'vmpl-new-session-with-error',
            UploadSessionFinished: 'vmpl-upload-session-finished',
        }
    }

    static NewSessionWithError(sessionId: number): DataEvent {
        const instance = new this(DataEvent.Types.NewSessionWithError, {bubbles: false, cancelable: false});
        instance.data = sessionId;
        return instance;
    }

    static UploadSessionFinished(sessions: IRecordSession[]): DataEvent {
        const instance = new this(DataEvent.Types.UploadSessionFinished, {bubbles: false, cancelable: false});
        instance.data = sessions;
        return instance;
    }
}

export default class RecorderManager implements IPaginatorLoader<IRecordSession> {
    readonly paginator: ItemPaginator<RecordSession, RecorderManager>;
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
                    self.sessionWorker.post(event)
                        .then(sessionId => {
                            sessionId === 0
                                || window.dispatchEvent(DataEvent.NewSessionWithError(sessionId));
                        })
                },
                plugins: [rrweb.getRecordConsolePlugin()],
            })
        })(this);
    }

    static init(endpoint: string, instance: string = 'BugReplay'): Promise<RecorderManager> {
        const urlWorker = new URL(location.origin);
        urlWorker.pathname = `${endpoint}/VMPL_BugReplay/js/bug-replay/session/worker`;

        return WorkerClient<SessionWorker>(urlWorker.toString())
            .then((sessionWorker: SessionWorker) => {
                return sessionWorker.initInstance(instance)
                    .then(() => new RecorderManager(sessionWorker))
            })
    }

    downloadImport(request: URL): Promise<RecorderManager> {
        return this.sessionWorker.import(request.toString())
            .then(() => this);
    }

    getEventsForSessionAt(sessions: IRecordSession[]): Promise<IRecordEvent[]> {
        return this.sessionWorker.events(sessions)
            .then(response => response.items);
    }

    uploadSessions(sessions: IRecordSession[]): Promise<void> {
        return this.sessionWorker.export(sessions)
            .then(() => this.paginator.clear())
            .then(() => window.dispatchEvent(DataEvent.UploadSessionFinished(sessions)))
            .then();
    }

    deleteAt(at: number): Promise<void> {
        return this.paginator.fetch(at)
            .then(session => this.delete([session]));
    }

    delete(sessions: RecordSession[]): Promise<void> {
        return this.sessionWorker.delete(sessions)
            .then(() => this.paginator.clear());
    }

    loadPaginatorItems(
        offset: number,
        limit: number,
        filter: IPaginatorFilter<IRecordSession>,
    ): Promise<IPaginatorResponse<RecordSession>> {
        return this.sessionWorker.sessions(offset, limit, filter);
    }

    session(sessionId: number): Promise<IRecordSession> {
        const filter = new PaginatorFilter<IRecordSession>();
        filter.append(new PaginatorFilter<IRecordSession>('id', sessionId));

        return this.sessionWorker.sessions(0, 1, filter)
            .then(items => items.items.pop());
    }
}
