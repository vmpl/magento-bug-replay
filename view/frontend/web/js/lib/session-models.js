/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/worker/decorator", "module"], function (_decorator, module) {
  var _dec, _dec2, _class;
  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
  var RecordSession = (_dec = (0, _decorator.WorkerArgument)(module.id), _dec2 = (0, _decorator.WorkerSerializable)({
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
//# sourceMappingURL=session-models.js.map