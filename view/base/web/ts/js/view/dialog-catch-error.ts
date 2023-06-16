import Dialog from "VMPL_BugReplay/js/view/dialog";
import {DataEvent} from "VMPL_BugReplay/js/lib/recorder-manager";

export default Dialog.extend({
    defaults: {
        template: 'VMPL_BugReplay/dialog/catch-error',
    },
    initObservable() {
        this._super();
        window.addEventListener(
            DataEvent.Types.NewSessionWithError,
            this.onSessionError.bind(this),
        );
        return this;
    },
    onSessionError(event: DataEvent) {
        console.log(event.data);
        this.show(true);
    }
});
