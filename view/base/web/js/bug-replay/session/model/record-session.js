/*eslint-disable */
/* jscs:disable */
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
define(["VMPL_BugReplay/js/lib/worker/decorator", "module"], function (_decorator, _module) {
  var _dec, _class;
  var RecordSession = (_dec = (0, _decorator.WorkerArgument)(_module.id), _dec(_class = /*#__PURE__*/function () {
    "use strict";

    function RecordSession(title, href, timestamp, id, uploaded, events) {
      if (id === void 0) {
        id = null;
      }
      this.title = title;
      this.href = href;
      this.timestamp = timestamp;
      this.id = id;
      this.uploaded = uploaded;
      this.events = events;
    }
    _createClass(RecordSession, [{
      key: "url",
      get: function get() {
        return new URL(this.href);
      }
    }, {
      key: "date",
      get: function get() {
        return new Date(this.timestamp);
      }
    }]);
    return RecordSession;
  }()) || _class);
  return {
    RecordSession: RecordSession
  };
});
//# sourceMappingURL=record-session.js.map