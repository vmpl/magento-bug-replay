/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["threads/worker", "dexie"], function (_worker, _dexie) {
  "use strict";

  var SessionDatabase = /*#__PURE__*/function (_dexie$Dexie) {
    _inheritsLoose(SessionDatabase, _dexie$Dexie);
    function SessionDatabase(databaseName) {
      var _this;
      _this = _dexie$Dexie.call(this, databaseName) || this;
      _this.version(1).stores({
        events: 'timestamp,type,data'
      });
      return _this;
    }
    var _proto = SessionDatabase.prototype;
    _proto.post = function post(record) {
      return this.events.put(record);
    };
    return SessionDatabase;
  }(_dexie.Dexie);
  var SessionWorker = /*#__PURE__*/function () {
    function SessionWorker() {}
    var _proto2 = SessionWorker.prototype;
    _proto2.initInstance = function initInstance(instance) {
      this.database = new SessionDatabase(instance);
      return Promise.resolve();
    };
    _proto2.sayHello = function sayHello() {
      console.log('Hello World!');
      return Promise.resolve();
    };
    _proto2.exportToObject = function exportToObject() {
      return {
        initInstance: this.initInstance.bind(this),
        sayHello: this.sayHello.bind(this)
      };
    };
    return SessionWorker;
  }();
  var sessionWorker = new SessionWorker();
  (0, _worker.expose)(sessionWorker.exportToObject());
});
//# sourceMappingURL=session-worker.js.map