/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/items-paginator", "VMPL_BugReplay/js/lib/worker/client"], function (_itemsPaginator, _client) {
  var RecorderManager = /*#__PURE__*/function () {
    "use strict";

    function RecorderManager(sessionWorker) {
      this.sessionWorker = sessionWorker;
      this.paginator = new _itemsPaginator([], this);
    }
    var _proto = RecorderManager.prototype;
    _proto.startRecord = function startRecord() {
      (function (self) {
        self.stopRecord = rrwebRecord({
          emit: function emit(event) {
            self.sessionWorker.post(event);
          },
          plugins: [rrwebConsoleRecord.getRecordConsolePlugin()]
        });
      })(this);
    };
    RecorderManager.init = function init(instance) {
      if (instance === void 0) {
        instance = 'BugReplay';
      }
      return fetch('/vmpl-bug-report/session/config').then(function (response) {
        return response.json();
      }).then(function (content) {
        return (0, _client.WorkerClient)(content.assetUrl.sessionLoader);
      }).then(function (sessionWorker) {
        return sessionWorker.initInstance(instance).then(function () {
          return new RecorderManager(sessionWorker);
        });
      });
    };
    _proto.getEventsForSessionAt = function getEventsForSessionAt(sessions) {
      return this.sessionWorker.events(sessions).then(function (response) {
        return response.items;
      });
    };
    _proto.uploadSessions = function uploadSessions(sessions) {
      var _this = this;
      return this.sessionWorker.export(sessions).then(function () {
        return _this.paginator.clear();
      });
    };
    _proto.deleteAt = function deleteAt(at) {
      var _this2 = this;
      return this.paginator.fetch(at).then(function (session) {
        return _this2.delete([session]);
      });
    };
    _proto.delete = function _delete(sessions) {
      var _this3 = this;
      return this.sessionWorker.delete(sessions).then(function () {
        return _this3.paginator.clear();
      });
    };
    _proto.loadPaginatorItems = function loadPaginatorItems(offset, limit, filter) {
      return this.sessionWorker.sessions(offset, limit, filter);
    };
    return RecorderManager;
  }();
  return RecorderManager;
});
//# sourceMappingURL=recorder-manager.js.map