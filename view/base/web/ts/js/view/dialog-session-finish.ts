import Dialog from "VMPL_BugReplay/js/view/dialog";
import ko from "knockout";
import {DataEvent} from "VMPL_BugReplay/js/lib/recorder-manager";

export default Dialog.extend({
    defaults: {
        template: 'VMPL_BugReplay/dialog/session-finish',
        timeout: 5000,
        content: {
            title: 'Session Uploaded.',
            message: 'Your recording ware uploaded to our server, we will down to fix it. Thank You'
        },
        elementConfig: {
            class: ko.observable<string>('message success left-bottom'),
        },
    },
    initObservable() {
        this._super();
        window.addEventListener(
            DataEvent.Types.UploadSessionFinished,
            this.onSessionUpload.bind(this),
        );
        return this;
    },
    onSessionUpload(event: DataEvent) {
        this.show(true);

        setTimeout(() => {
            this.show(false);
        }, this.timeout);
    }
});
