import Component from "uiComponent";
import ko from 'knockout';

export default Component.extend({
    show: ko.observable<boolean>(false),
    modal: false,
    defaults: {
        dialogTemplate: 'VMPL_BugReplay/dialog-wrapper',
        contentTemplate: undefined,
        elementConfig: {
            class: ko.observable<string>('left-bottom'),
        }
    },
    initialize(options: object) {
        !!this.constructor.defaults.contentTemplate
            || (this.constructor.defaults.contentTemplate = this.constructor.defaults.template);
        this.constructor.defaults.template = this.constructor.defaults.dialogTemplate;

        this._super(options);
        this.show.subscribe((shown: boolean) => {
            if (this.dialogElement.open !== shown) {
                if(!shown) {
                    this.dialogElement.close();
                } else {
                    this.modal
                        ? this.dialogElement.showModal()
                        : this.dialogElement.show();
                }
            }
        });

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
    onCancel(event: Event) {
        if (!event.defaultPrevented) {
            this.show(false);
        }
    },
    onClose(event: Event) {
        this.show(false);
    }
})
