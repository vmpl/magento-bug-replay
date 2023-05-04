/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["threads", "dexie"], function (_threads, _dexie) {
  var SessionDataBase = /*#__PURE__*/function (_dexie2) {
    "use strict";

    _inheritsLoose(SessionDataBase, _dexie2);
    function SessionDataBase(databaseName) {
      var _this;
      _this = _dexie2.call(this, databaseName) || this;
      _this.version(1).stores({
        events: 'timestamp,type,data'
      });
      return _this;
    }
    var _proto = SessionDataBase.prototype;
    _proto.post = function post(record) {
      return this.events.put(record);
    };
    return SessionDataBase;
  }(_dexie);
  var SessionWorker = /*#__PURE__*/function () {
    "use strict";

    function SessionWorker() {}
    var _proto2 = SessionWorker.prototype;
    _proto2.initInstance = function initInstance(instance) {
      this.database = new SessionDataBase(instance);
      return Promise.resolve();
    };
    _proto2.sayHello = function sayHello() {
      console.log('Hello World!');
      return Promise.resolve();
    };
    return SessionWorker;
  }();
  (0, _threads.expose)(SessionWorker);
  return SessionWorker;
});
//# sourceMappingURL=session-worker.js.map