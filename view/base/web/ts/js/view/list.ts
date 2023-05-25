import Component from 'uiComponent';
import ko from 'knockout';
import {IRecordSession} from "VMPL_BugReplay/js/api/session";
import Data from 'VMPL_BugReplay/js/model/data'
import sessionReplay from "VMPL_BugReplay/js/action/session-replay";

export default Component.extend({
    list: ko.observableArray([]),
    dynamicLoad(): Promise<void> {
        return Data.manager
            .then(manager => manager.paginator.getPage())
            .then((items: IRecordSession[]) => this.list.push(...items))
    },
    sessionReplay,
});
