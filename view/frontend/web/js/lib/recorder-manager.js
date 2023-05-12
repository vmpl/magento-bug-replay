/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/items-paginator", "VMPL_BugReplay/js/lib/worker/client", "VMPL_BugReplay/js/lib/session-models"], function (_itemsPaginator, _client, _sessionModels) {
  var RecorderManager = /*#__PURE__*/function () {
    "use strict";

    function RecorderManager(sessionWorker) {
      this.sessionWorker = sessionWorker;
      this.paginator = new _itemsPaginator([], this);
    }
    var _proto = RecorderManager.prototype;
    _proto.startRecord = function startRecord() {
      (function (self) {
        self.stopRecord = rrweb.record({
          emit: function emit(event) {
            self.sessionWorker.post(event);
          }
        });
      })(this);
    };
    RecorderManager.init = function init(instance) {
      if (instance === void 0) {
        instance = 'BugReplay';
      }
      return fetch('/vmpl-bug-report/config/worker').then(function (response) {
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
    _proto.loadPaginatorItems = function loadPaginatorItems(offset, limit, filter) {
      return this.sessionWorker.sessions(offset, limit, filter).then(function (items) {
        items.items = items.items.map(function (it) {
          return new _sessionModels.RecordSession(new URL(it.href), it.title, new Date(it.timestamp));
        });
        return items;
      });
    };
    return RecorderManager;
  }();
  return RecorderManager;
});
//# sourceMappingURL=recorder-manager.js.map