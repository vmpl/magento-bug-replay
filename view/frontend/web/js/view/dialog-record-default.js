/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/dialog", "knockout"], function (_dialog, _knockout) {
  var _default = _dialog.extend({
    defaults: {
      template: 'VMPL_BugReplay/dialog/record-default',
      confirmed: false,
      policyUrl: new URL(location.origin).toString(),
      content: {
        title: 'Session Record Enabled.',
        message: 'Currently browser is recording your sessions and it\'s saved securely locally.',
        confirm: 'Affirmative',
        policyPage: 'Policy Recordings'
      },
      elementConfig: {
        class: _knockout.observable('message notice left-bottom')
      },
      imports: {
        enabled: '${ $.provider }:configuration.enabled',
        toggle: '${ $.provider }:configuration.enable_toggle'
      },
      links: {
        confirmed: '${ $.provider }:$recordConfirmed'
      }
    },
    initObservable: function initObservable() {
      this._super();
      this.observe(['confirmed']);
      return this;
    },
    afterRenderDialog: function afterRenderDialog(element) {
      this._super(element);
      this.show(this.enabled === '1' && !this.confirmed());
    },
    onConfirm: function onConfirm() {
      this.confirmed(true);
      this.show(false);
    }
  });
  return _default;
});
//# sourceMappingURL=dialog-record-default.js.map