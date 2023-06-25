/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/dialog", "knockout", "VMPL_BugReplay/js/bug-replay/recorder-manager"], function (_dialog, _knockout, _recorderManager) {
  var _default = _dialog.extend({
    defaults: {
      template: 'VMPL_BugReplay/dialog/session-finish',
      timeout: 5000,
      content: {
        title: 'Session Uploaded.',
        message: 'Your recording ware uploaded to our server, we will down to fix it. Thank You'
      },
      elementConfig: {
        class: _knockout.observable('message success left-bottom')
      }
    },
    initObservable: function initObservable() {
      this._super();
      window.addEventListener(_recorderManager.DataEvent.Types.UploadSessionFinished, this.onSessionUpload.bind(this));
      return this;
    },
    onSessionUpload: function onSessionUpload(event) {
      var _this = this;
      this.show(true);
      setTimeout(function () {
        _this.show(false);
      }, this.timeout);
    }
  });
  return _default;
});
//# sourceMappingURL=dialog-session-finish.js.map