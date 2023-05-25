import {IRecordSession} from "VMPL_BugReplay/js/api/session";
import Data from 'VMPL_BugReplay/js/model/data'

export default function (session: IRecordSession) {
    return Data.manager
        .then(manager => manager.getEventsForSessionAt([session]))
        .then(events => {
            Data.events(events);
        })
}
