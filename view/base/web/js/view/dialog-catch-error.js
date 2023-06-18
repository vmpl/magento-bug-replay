/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/dialog", "VMPL_BugReplay/js/lib/recorder-manager", "knockout"], function (_dialog, _recorderManager, _knockout) {
  var _default = _dialog.extend({
    defaults: {
      template: 'VMPL_BugReplay/dialog/catch-error',
      content: {
        title: 'Error Detected.',
        message: 'In previos sessions error was caught, the recording was saved on your browser memory.',
        upload: 'Upload'
      },
      elementConfig: {
        class: _knockout.observable('message error left-bottom')
      },
      imports: {
        manager: '${ $.provider }:manager'
      }
    },
    initObservable: function initObservable() {
      this._super();
      window.addEventListener(_recorderManager.DataEvent.Types.NewSessionWithError, this.onSessionError.bind(this));
      return this;
    },
    onSessionError: function onSessionError(event) {
      this.sessionId = event.data;
      this.show(true);
    },
    uploadSession: function uploadSession() {
      var _this = this;
      this.manager().then(function (manager) {
        return manager.session(_this.sessionId).then(function (session) {
          return manager.uploadSessions([session]);
        }).then(function () {
          return _this.show(false);
        });
      });
    }
  });
  return _default;
});
//# sourceMappingURL=dialog-catch-error.js.map