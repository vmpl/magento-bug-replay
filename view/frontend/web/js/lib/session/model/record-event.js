/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/worker/decorator", "module"], function (_decorator, _module) {
  var _dec, _class;
  var RecordEvent = (_dec = (0, _decorator.WorkerArgument)(_module.id), _dec(_class = function RecordEvent(timestamp, type, data, session) {
    "use strict";

    this.timestamp = timestamp;
    this.type = type;
    this.data = data;
    this.session = session;
  }) || _class);
  return {
    RecordEvent: RecordEvent
  };
});
//# sourceMappingURL=record-event.js.map