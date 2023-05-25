import ko from 'knockout';
import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";

export default {
    manager: RecorderManager.init(),
    events: ko.observableArray([]),
}
