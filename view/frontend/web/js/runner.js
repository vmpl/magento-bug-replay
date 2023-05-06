/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/recorder-manager"], function (_recorderManager) {
  var Runner = /*#__PURE__*/function () {
    "use strict";

    function Runner(manager) {
      this.manager = manager;
    }
    var _proto = Runner.prototype;
    _proto.execute = function execute() {
      this.manager.sayHello();
    };
    return Runner;
  }();
  var runner = _recorderManager.init().then(function (manager) {
    return new Runner(manager);
  });
  var _default = runner;
  return _default;
});
//# sourceMappingURL=runner.js.map