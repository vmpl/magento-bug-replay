/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/worker/decorator", "module"], function (_decorator, _module) {
  var _dec, _dec2, _class;
  var RecordSession = (_dec = (0, _decorator.WorkerArgument)(_module.id), _dec2 = (0, _decorator.WorkerSerializable)({
    href: [function (it) {
      return it.toString();
    }, function (it) {
      return new URL(it);
    }],
    timestamp: [function (it) {
      return it.getTime();
    }, function (it) {
      return new Date(it);
    }]
  }), _dec(_class = _dec2(_class = function RecordSession(href, title, timestamp) {
    "use strict";

    this.href = href;
    this.title = title;
    this.timestamp = timestamp;
  }) || _class) || _class);
  return {
    RecordSession: RecordSession
  };
});
//# sourceMappingURL=record-session.js.map