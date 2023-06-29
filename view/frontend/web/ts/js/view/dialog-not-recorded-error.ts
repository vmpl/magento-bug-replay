import Dialog from "VMPL_BugReplay/js/view/dialog";
import ko from "knockout";

export default Dialog.extend({
    defaults: {
        template: 'VMPL_BugReplay/dialog/not-recorded-error',
        confirmed: false,
        policyUrl: new URL(location.origin).toString(),
        content: {
            title: 'Error detected.',
            message: 'Web session wasn\'t recorded with given error, you can enable it bellow.',
            close: 'Close',
        },
        recordEnable: false,
        elementConfig: {
            class: ko.observable<string>('message error left-bottom'),
        },
        imports: {
            toggleEnabled: '${ $.provider }:configuration.enable_toggle',
        },
        links: {
            recordEnable: '${ $.provider }:$recordEnable',
        },
        modules: {
            toggle: 'vmpl_bug_replay_record_toggle.vmpl_bug_replay_record_toggle'
        }
    },
    initialize(options: object) {
        this._super(options);
        window.addEventListener('error', this.onError.bind(this), {passive: true});
        return this;
    },
    initObservable() {
        this._super();
        this.observe([
            'recordEnable',
        ]);
        return this;
    },
    onError(event: ErrorEvent) {
        this.show(this.recordEnable() === '0' && this.toggleEnabled === '1');
    }
})
