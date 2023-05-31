import Component from 'uiComponent';
import ko from 'knockout';
import {RecordSession} from "VMPL_BugReplay/js/lib/session/model/record-session";

export default Component.extend({
    defaults: {
        ignoreTmpls: {
            data: true
        }
    },
    sessions: ko.observableArray<RecordSession[]>([]),
    activeSessionId: ko.observable<number>(0),
})
