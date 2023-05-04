/*eslint-disable */
/* jscs:disable */
define([], function () {
  var RecorderManager = /*#__PURE__*/function () {
    "use strict";

    function RecorderManager(message) {
      this.message = message;
    }
    var _proto = RecorderManager.prototype;
    _proto.logMessage = function logMessage() {
      console.log(this.message);
    };
    return RecorderManager;
  }();
  return RecorderManager;
});
//# sourceMappingURL=recorder-manager.js.map