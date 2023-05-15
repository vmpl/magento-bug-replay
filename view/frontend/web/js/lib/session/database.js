/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["dexie", "dexie-export-import", "VMPL_BugReplay/js/api/session", "VMPL_BugReplay/js/lib/session/model/record-event"], function (_dexie, _dexieExportImport, _session, _recordEvent) {
  var Database = /*#__PURE__*/function (_dexie$Dexie) {
    "use strict";

    _inheritsLoose(Database, _dexie$Dexie);
    function Database(databaseName) {
      var _this;
      _this = _dexie$Dexie.call(this, databaseName) || this;
      var counter = 0;
      _this.version(++counter).stores({
        events: '&timestamp,*type,data'
      });
      _this.events.mapToClass(_recordEvent.RecordEvent);
      return _this;
    }
    var _proto = Database.prototype;
    _proto.postRecord = function postRecord(record) {
      return this.events.put(record);
    };
    _proto.getFullSnapshotsWithMeta = function getFullSnapshotsWithMeta() {
      var types = Array.of(_session.EventType.FullSnapshot.valueOf(), _session.EventType.Meta.valueOf());
      return this.events.orderBy('timestamp').reverse().filter(function (it) {
        return types.indexOf(it == null ? void 0 : it.type.valueOf()) !== -1;
      }).toArray();
    };
    _proto.getEvents = function getEvents(timestamp) {
      var _this2 = this;
      return this.events.orderBy('timestamp').reverse().filter(function (it) {
        return (it == null ? void 0 : it.type) === _session.EventType.Meta;
      }).filter(function (it) {
        return (it == null ? void 0 : it.timestamp) > timestamp;
      }).limit(1).first().then(function (nextSession) {
        return _this2.events.orderBy('timestamp').reverse().filter(function (it) {
          var _nextSession$timestam;
          return (it == null ? void 0 : it.timestamp) >= timestamp && (it == null ? void 0 : it.timestamp) < ((_nextSession$timestam = nextSession == null ? void 0 : nextSession.timestamp) != null ? _nextSession$timestam : Number.MAX_VALUE);
        }).toArray();
      });
    };
    _proto.exportSessions = function exportSessions(fromDate, toDate) {
      return (0, _dexieExportImport.exportDB)(this, {
        filter: function filter(table, value, key) {
          switch (table) {
            case 'events':
              return value.timestamp >= ((fromDate == null ? void 0 : fromDate.getTime()) || Number.MIN_VALUE) && value.timestamp <= ((toDate == null ? void 0 : toDate.getTime()) || Number.MAX_VALUE);
            default:
              return false;
          }
        }
      });
    };
    return Database;
  }(_dexie.Dexie);
  return Database;
});
//# sourceMappingURL=database.js.map