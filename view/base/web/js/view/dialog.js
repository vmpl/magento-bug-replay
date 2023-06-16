/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout"], function (_uiComponent, _knockout) {
  var _default = _uiComponent.extend({
    show: _knockout.observable(false),
    modal: false,
    defaults: {
      dialogTemplate: 'VMPL_BugReplay/dialog-wrapper',
      contentTemplate: undefined,
      elementConfig: {
        class: _knockout.observable('left-bottom')
      }
    },
    initialize: function initialize(options) {
      var _this = this;
      !!this.constructor.defaults.contentTemplate || (this.constructor.defaults.contentTemplate = this.constructor.defaults.template);
      this.constructor.defaults.template = this.constructor.defaults.dialogTemplate;
      this._super(options);
      this.show.subscribe(function (shown) {
        if (_this.dialogElement.open !== shown) {
          if (!shown) {
            _this.dialogElement.close();
          } else {
            _this.modal ? _this.dialogElement.showModal() : _this.dialogElement.show();
          }
        }
      });
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