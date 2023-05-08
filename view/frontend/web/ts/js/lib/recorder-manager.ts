import {spawn} from "threads";
import {RecordEvent, RecordSession, SessionWorker} from "VMPL_BugReplay/js/api/session";
import {ConfigWorkerContent} from "VMPL_BugReplay/js/api/response";
import SessionPaginator from "VMPL_BugReplay/js/lib/session-paginator";

export default class RecorderManager {
    stopRecord: Function;
    readonly paginator: SessionPaginator

    protected constructor(
        protected readonly sessionWorker: SessionWorker,
    ) {
        this.paginator = new SessionPaginator(this.loadSessionFromWorker.bind(this))
    }

    startRecord() {
        ((self) => {
            self.stopRecord = rrweb.record({
                emit(event: RecordEvent) {
                    self.sessionWorker.post(event);
                }
            })
        })(this);
    }

    static init(instance: string = 'BugReplay'): Promise<RecorderManager> {
        return fetch('/vmpl-bug-report/config/worker')
            .then(response => response.json())
            .then((content: ConfigWorkerContent) => spawn(new Worker(content.assetUrl.sessionLoader)))
            .then((sessionWorker: SessionWorker) => {
                return sessionWorker.initInstance(instance)
                    .then(() => new RecorderManager(sessionWorker))
            })
    }

    loadSessionFromWorker(offset: number, limit: number) {
        return this.sessionWorker.sessions(offset, limit)
            .then(items => items.map<RecordSession>(it => {
                return {
                    timestamp: new Date(it.timestamp),
                    href: new URL(it.href),
                    title: it.title,
                }
            }))
    }
}
