import Dialog from "VMPL_BugReplay/js/view/dialog";
import ko from "knockout";

export default Dialog.extend({
    defaults: {
        template: 'VMPL_BugReplay/dialog/record-default',
        confirmed: false,
        policyUrl: new URL(location.origin).toString(),
        content: {
            title: 'Session Record Enabled.',
            message: 'Currently browser is recording your sessions and it\'s saved securely locally.',
            confirm: 'Affirmative',
            policyPage: 'Policy Recordings',
        },
        elementConfig: {
            class: ko.observable<string>('message notice left-bottom'),
        },
        imports: {
            enabled: '${ $.provider }:configuration.enabled',
            toggle: '${ $.provider }:configuration.enable_toggle',
        },
        links: {
            confirmed: '${ $.provider }:$recordConfirmed',
        },
    },
    initObservable() {
        this._super();
        this.observe([
            'confirmed',
        ]);
        return this;
    },
    afterRenderDialog(element: HTMLDialogElement) {
        this._super(element);
        this.show(this.enabled === '1' && !this.confirmed());
    },
    onConfirm() {
        this.confirmed(true);
        this.show(false);
    }
})
