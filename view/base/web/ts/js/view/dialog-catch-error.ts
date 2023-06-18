import Dialog from "VMPL_BugReplay/js/view/dialog";
import RecorderManager, {DataEvent} from "VMPL_BugReplay/js/lib/recorder-manager";
import ko from "knockout";

export default Dialog.extend({
    defaults: {
        template: 'VMPL_BugReplay/dialog/catch-error',
        content: {
            title: 'Error Detected.',
            message: 'In previos sessions error was caught, the recording was saved on your browser memory.',
            upload: 'Upload',
        },
        elementConfig: {
            class: ko.observable<string>('message error left-bottom'),
        },
        imports: {
            manager: '${ $.provider }:manager',
        },
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
        this.sessionId = <number>event.data;
        this.show(true);
    },
    uploadSession() {
        (<Promise<RecorderManager>>this.manager())
            .then(manager => {
                return manager.session(this.sessionId)
                    .then(session => manager.uploadSessions([session]))
                    .then(() => this.show(false));
            })
    },
});
