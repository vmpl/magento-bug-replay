/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/dialog", "knockout"], function (_dialog, _knockout) {
  var _default = _dialog.extend({
    defaults: {
      template: 'VMPL_BugReplay/dialog/not-recorded-error',
      confirmed: false,
      policyUrl: new URL(location.origin).toString(),
      content: {
        title: 'Error detected.',
        message: 'Web session wasn\'t recorded with given error, you can enable it bellow.',
        close: 'Close'
      },
      recordEnable: false,
      elementConfig: {
        class: _knockout.observable('message error left-bottom')
      },
      imports: {
        toggleEnabled: '${ $.provider }:configuration.enable_toggle'
      },
      links: {
        recordEnable: '${ $.provider }:$recordEnable'
      },
      modules: {
        toggle: 'vmpl_bug_replay_record_toggle.vmpl_bug_replay_record_toggle'
      }
    },
    initialize: function initialize(options) {
      this._super(options);
      window.addEventListener('error', this.onError.bind(this), {
        passive: true
      });
      return this;
    },
    initObservable: function initObservable() {
      this._super();
      this.observe(['recordEnable']);
      return this;
    },
    onError: function onError(event) {
      this.show(this.recordEnable() === '0' && this.toggleEnabled === '1');
    }
  });
  return _default;
});
//# sourceMappingURL=dialog-not-recorded-error.js.map