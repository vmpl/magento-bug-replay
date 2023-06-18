import Component from "uiComponent";
import ko from 'knockout';

export default Component.extend({
    defaults: {
        dialogTemplate: 'VMPL_BugReplay/dialog-wrapper',
        contentTemplate: undefined,
        elementConfig: {
            class: ko.observable<string>('left-bottom'),
        },
        modal: false,
        show: false,
        listens: {
            show: 'onShow',
        }
    },
    initialize(options: object) {
        !!this.constructor.defaults.contentTemplate
            || (this.constructor.defaults.contentTemplate = this.constructor.defaults.template);
        this.constructor.defaults.template = this.constructor.defaults.dialogTemplate;

        this._super(options);
        return this;
    },
    initObservable() {
        this._super();
        this.observe([
            'show',
        ]);
        return this;
    },
    afterRenderDialog(element: HTMLDialogElement) {
        this.dialogElement = element;
        this.dialogElement.addEventListener('cancel', this.onCancel.bind(this));
        this.dialogElement.addEventListener('close', this.onClose.bind(this));
    },
    getContentTemplate() {
        return this.contentTemplate;
    },
    onShow(shown: boolean) {
        if (this.dialogElement.open !== shown) {
            if(!shown) {
                this.dialogElement.close();
            } else {
                this.modal
                    ? this.dialogElement.showModal()
                    : this.dialogElement.show();
            }
        }
    },
    onCancel(event: Event) {
        if (!event.defaultPrevented) {
            this.show(false);
        }
    },
    onClose(event: Event) {
        this.show(false);
    }
})
