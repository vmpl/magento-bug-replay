/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout"], function (_uiComponent, _knockout) {
  var _default = _uiComponent.extend({
    defaults: {
      dialogTemplate: 'VMPL_BugReplay/dialog-wrapper',
      contentTemplate: undefined,
      elementConfig: {
        class: _knockout.observable('left-bottom')
      },
      modal: false,
      show: false,
      listens: {
        show: 'onShow'
      }
    },
    initialize: function initialize(options) {
      !!this.constructor.defaults.contentTemplate || (this.constructor.defaults.contentTemplate = this.constructor.defaults.template);
      this.constructor.defaults.template = this.constructor.defaults.dialogTemplate;
      this._super(options);
      return this;
    },
    initObservable: function initObservable() {
      this._super();
      this.observe(['show']);
      return this;
    },
    afterRenderDialog: function afterRenderDialog(element) {
      this.dialogElement = element;
      this.dialogElement.addEventListener('cancel', this.onCancel.bind(this));
      this.dialogElement.addEventListener('close', this.onClose.bind(this));
    },
    getContentTemplate: function getContentTemplate() {
      return this.contentTemplate;
    },
    onShow: function onShow(shown) {
      if (this.dialogElement.open !== shown) {
        if (!shown) {
          this.dialogElement.close();
        } else {
          this.modal ? this.dialogElement.showModal() : this.dialogElement.show();
        }
      }
    },
    onCancel: function onCancel(event) {
      if (!event.defaultPrevented) {
        this.show(false);
      }
    },
    onClose: function onClose(event) {
      this.show(false);
    }
  });
  return _default;
});
//# sourceMappingURL=dialog.js.map