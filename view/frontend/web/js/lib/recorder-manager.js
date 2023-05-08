/*eslint-disable */
/* jscs:disable */
define(["threads", "VMPL_BugReplay/js/lib/session-paginator"], function (_threads, _sessionPaginator) {
  var RecorderManager = /*#__PURE__*/function () {
    "use strict";

    function RecorderManager(sessionWorker) {
      this.sessionWorker = sessionWorker;
      this.paginator = new _sessionPaginator(this.loadSessionFromWorker.bind(this));
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
        return (0, _threads.spawn)(new Worker(content.assetUrl.sessionLoader));
      }).then(function (sessionWorker) {
        return sessionWorker.initInstance(instance).then(function () {
          return new RecorderManager(sessionWorker);
        });
      });
    };
    _proto.loadSessionFromWorker = function loadSessionFromWorker(offset, limit) {
      return this.sessionWorker.sessions(offset, limit).then(function (items) {
        return items.map(function (it) {
          return {
            timestamp: new Date(it.timestamp),
            href: new URL(it.href),
            title: it.title
          };
        });
      });
    };
    return RecorderManager;
  }();
  return RecorderManager;
});
//# sourceMappingURL=recorder-manager.js.map