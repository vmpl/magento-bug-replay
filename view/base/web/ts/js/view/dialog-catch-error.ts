import Dialog from "VMPL_BugReplay/js/view/dialog";
import RecorderManager, {DataEvent} from "VMPL_BugReplay/js/bug-replay/recorder-manager";
import ko from "knockout";

export default Dialog.extend({
    defaults: {
        template: 'VMPL_BugReplay/dialog/catch-error',
        content: {
            title: 'Error Detected.',
            message: 'In previos sessions error was caught, the recording was saved on your browser memory.',
            preview: 'Preview',
            upload: 'Upload',
            close: 'Close',
        },
        elementConfig: {
            class: ko.observable<string>('message info left-bottom'),
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
        this.source.shouldReport()
            ? this.uploadSession()
            : this.show(true);
    },
    uploadSession() {
        (<Promise<RecorderManager>>this.manager())
            .then(manager => {
                return manager.session(this.sessionId)
                    .then(session => manager.uploadSessions([session]))
                    .then(() => this.show(false));
            })
    },
    modalPreview() {
        (<Promise<RecorderManager>>this.manager())
            .then(manager => manager.session(this.sessionId))
            .then(session => {
                this.elementConfig.class('message info full-center');

                const previewPlayer = this.getChild('previewPlayer')
                previewPlayer.sessionReplay(session);
            })
    }
});
