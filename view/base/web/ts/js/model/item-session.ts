import {RecordSession} from "VMPL_BugReplay/js/lib/session/model/record-session";
import Primary from "VMPL_BugReplay/js/lib/decorator/primary";
import ko from "knockout";
import {IRecordSession} from "VMPL_BugReplay/js/api/session";

class Factory<T extends IRecordSession> {
    create(session: RecordSession) {
        return new ItemSession(
            session.title,
            session.href,
            session.timestamp,
            session.id,
            session.uploaded,
            session.events,
        );
    }
}
export const ItemSessionFactory = new Factory<ItemSession>()

@Primary('id')
export default class ItemSession extends RecordSession {
    public readonly optionsVisible: KnockoutObservable<boolean> = ko.observable(false);
}
