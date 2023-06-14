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
    RecorderManager.init = function init(endpoint, instance) {
      if (instance === void 0) {
        instance = 'BugReplay';
      }
      var urlWorker = new URL(location.origin);
      urlWorker.pathname = endpoint + "/VMPL_BugReplay/js/lib/session/worker";
      return (0, _client.WorkerClient)(urlWorker.toString()).then(function (sessionWorker) {
        return sessionWorker.initInstance(instance).then(function () {
          return new RecorderManager(sessionWorker);
        });
      });
    };
    _proto.downloadImport = function downloadImport(request) {
      var _this = this;
      return this.sessionWorker.import(request.toString()).then(function () {
        return _this;
      });
    };
    _proto.getEventsForSessionAt = function getEventsForSessionAt(sessions) {
      return this.sessionWorker.events(sessions).then(function (response) {
        return response.items;
      });
    };
    _proto.uploadSessions = function uploadSessions(sessions) {
      var _this2 = this;
      return this.sessionWorker.export(sessions).then(function () {
        return _this2.paginator.clear();
      });
    };
    _proto.deleteAt = function deleteAt(at) {
      var _this3 = this;
      return this.paginator.fetch(at).then(function (session) {
        return _this3.delete([session]);
      });
    };
    _proto.delete = function _delete(sessions) {
      var _this4 = this;
      return this.sessionWorker.delete(sessions).then(function () {
        return _this4.paginator.clear();
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