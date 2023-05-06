/*eslint-disable */
/* jscs:disable */
define(["threads"], function (_threads) {
  var RecorderManager = /*#__PURE__*/function () {
    "use strict";

    function RecorderManager(sessionWorker) {
      this.sessionWorker = sessionWorker;
    }
    var _proto = RecorderManager.prototype;
    _proto.sayHello = function sayHello() {
      this.sessionWorker.sayHello();
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
    return RecorderManager;
  }();
  return RecorderManager;
});
//# sourceMappingURL=recorder-manager.js.map