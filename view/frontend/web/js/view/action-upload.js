/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout", "mage/translate", "VMPL_BugReplay/js/model/data"], function (_uiComponent, _knockout, _translate, _data) {
  var _default = _uiComponent.extend({
    visibility: _knockout.observable(false),
    sessions: _knockout.observableArray(),
    defaults: {
      template: 'VMPL_BugReplay/player/mass-action',
      submitLabel: (0, _translate)('Upload'),
      modules: {
        list: 'player.sidebar.list'
      },
      imports: {
        sessions: '${ $.provider }:sessions'
      }
    },
    initObservable: function initObservable() {
      var _this = this;
      this._super();
      this.sessions.subscribe(function (sessions) {
        Object.values(sessions).forEach(function (session) {
          session.upload.subscribe(_this.onSessionUploadChange.bind(_this));
        });
      });
      return this;
    },
    onSessionUploadChange: function onSessionUploadChange() {
      var sessions = this.sessions();
      var uploadChecked = Object.values(sessions).some(function (it) {
        return it.upload();
      });
      this.visibility(uploadChecked);
    },
    onSubmit: function onSubmit(target, event) {
      var _this2 = this;
      event.stopPropagation();
      var sessions = Object.values(this.sessions()).filter(function (it) {
        return it.upload();
      });
      _data.manager.then(function (manager) {
        return manager.uploadSessions(sessions);
      }).then(function () {
        _this2.onCancel();
        return _this2.list().reload();
      }).then(function () {
        return alert((0, _translate)('Uploaded'));
      });
    },
    onCancel: function onCancel() {
      Object.values(this.sessions()).forEach(function (session) {
        return session.upload(false);
      });
    }
  });
  return _default;
});
//# sourceMappingURL=action-upload.js.map