/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/worker/decorator", "module", "VMPL_BugReplay/js/api/session"], function (_decorator, _module, _session) {
  var _dec, _dec2, _class;
  var RecordEvent = (_dec = (0, _decorator.WorkerArgument)(_module.id), _dec2 = (0, _decorator.WorkerSerializable)({
    type: [function (it) {
      return it.valueOf();
    }, function (it) {
      return _session.EventType[it];
    }]
  }), _dec(_class = _dec2(_class = function RecordEvent(timestamp, type, data) {
    "use strict";

    this.timestamp = timestamp;
    this.type = type;
    this.data = data;
  }) || _class) || _class);
  return {
    RecordEvent: RecordEvent
  };
});
//# sourceMappingURL=record-event.js.map