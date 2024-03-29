import Dialog from "VMPL_BugReplay/js/view/dialog";
import RecorderManager, {DataEvent} from "VMPL_BugReplay/js/bug-replay/recorder-manager";
import ko from "knockout";
import {EventPostResult} from "VMPL_BugReplay/js/api/session";
import tr from "../../../moment/locale/tr";

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
            configurationIgnoreRules: '${ $.provider }:configuration.ignore_rules',
        },
    },
    initialize(options: object) {
        this._super(options);

        this.ignoreRules = (this.configurationIgnoreRules || '').split('\n')
            .map((it: string) => {
                if (it === "") {
                    return null;
                }

                const components: Array<string> = it.trim().split('/');
                try {
                    return new RegExp(components.at(1), components.at(2))
                } catch (e) {
                    return null;
                }
            }).filter((it?: RegExp) => it !== null);

        return this;
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
        const result = <EventPostResult>event.data;
        result.errors = result.errors.filter(it => {
            for (let ignoreRule of this.ignoreRules) {
                if (ignoreRule.test(it.message)) {
                    return false;
                }
            }

            return true;
        })

        if (result.errors.length === 0) {
            return;
        }

        this.sessionId = result.sessionId;
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
