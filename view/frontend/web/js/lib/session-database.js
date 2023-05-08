/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["dexie", "VMPL_BugReplay/js/api/session"], function (_dexie, _session) {
  var SessionDatabase = /*#__PURE__*/function (_dexie$Dexie) {
    "use strict";

    _inheritsLoose(SessionDatabase, _dexie$Dexie);
    function SessionDatabase(databaseName) {
      var _this;
      _this = _dexie$Dexie.call(this, databaseName) || this;
      _this.version(1).stores({
        events: 'timestamp,type,data'
      });
      _this.version(2).stores({
        events: '&timestamp,*type,data'
      });
      return _this;
    }
    var _proto = SessionDatabase.prototype;
    _proto.postRecord = function postRecord(record) {
      return this.events.add(record);
    };
    _proto.getFullSnapshotsWithMeta = function getFullSnapshotsWithMeta() {
      var types = Array.of(_session.EventType.FullSnapshot.valueOf(), _session.EventType.Meta.valueOf());
      return this.events.orderBy('timestamp').reverse().filter(function (it) {
        return types.indexOf(it.type.valueOf()) !== -1;
      }).toArray();
    };
    return SessionDatabase;
  }(_dexie.Dexie);
  return SessionDatabase;
});
//# sourceMappingURL=session-database.js.map