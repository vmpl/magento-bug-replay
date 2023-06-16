/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/dialog", "VMPL_BugReplay/js/lib/recorder-manager"], function (_dialog, _recorderManager) {
  var _default = _dialog.extend({
    defaults: {
      template: 'VMPL_BugReplay/dialog/catch-error'
    },
    initObservable: function initObservable() {
      this._super();
      window.addEventListener(_recorderManager.DataEvent.Types.NewSessionWithError, this.onSessionError.bind(this));
      return this;
    },
    onSessionError: function onSessionError(event) {
      console.log(event.data);
      this.show(true);
    }
  });
  return _default;
});
//# sourceMappingURL=dialog-catch-error.js.map