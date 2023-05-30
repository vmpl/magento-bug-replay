/*eslint-disable */
/* jscs:disable */
define(["knockout", "VMPL_BugReplay/js/lib/recorder-manager"], function (_knockout, _recorderManager) {
  var _default = {
    manager: _recorderManager.init(),
    events: _knockout.observableArray([])
  };
  return _default;
});
//# sourceMappingURL=data.js.map