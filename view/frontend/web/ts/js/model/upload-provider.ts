import Component from 'uiComponent';
import ko from 'knockout';
import {RecordSession} from "VMPL_BugReplay/js/bug-replay/session/model/record-session";

export default Component.extend({
    defaults: {
        ignoreTmpls: {
            data: true
        },
    },
    selected: ko.observableArray<number[]>([]),
    selectItem(item: RecordSession, checked: boolean) {
        const exists = this.selected().some((it: RecordSession) => it.id === item.id);
        if (!exists && checked) {
            this.selected.push(item.id);
        } else if (exists && !checked) {
            this.selected.remove(item.id);
        }
    }
})
