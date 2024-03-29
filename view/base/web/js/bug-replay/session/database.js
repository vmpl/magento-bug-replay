/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["dexie", "dexie-export-import", "VMPL_BugReplay/js/bug-replay/session/model/record-event", "VMPL_BugReplay/js/bug-replay/session/model/record-session", "VMPL_BugReplay/js/bug-replay/session/model/error-console"], function (_dexie, _dexieExportImport, _recordEvent, _recordSession, _errorConsole) {
  var Database = /*#__PURE__*/function (_dexie$Dexie) {
    "use strict";

    _inheritsLoose(Database, _dexie$Dexie);
    function Database(databaseName) {
      var _this;
      _this = _dexie$Dexie.call(this, databaseName) || this;
      _this.initial();
      _this.sessions.mapToClass(_recordSession.RecordSession);
      _this.events.mapToClass(_recordEvent.RecordEvent);
      _this.buffer.mapToClass(_recordEvent.RecordEvent);
      _this.errors.mapToClass(_errorConsole);
      return _this;
    }
    var _proto = Database.prototype;
    _proto.export = function _export(options) {
      return (0, _dexieExportImport.exportDB)(this, options);
    };
    _proto.import = function _import(blob, options) {
      return (0, _dexieExportImport.importInto)(this, blob, options);
    };
    _proto.initial = function initial() {
      this.version(1).stores({
        sessions: '++id,&timestamp,href,title,*uploaded',
        events: '&timestamp,*type,data,sessionId',
        buffer: '&timestamp,*type,data',
        errors: '++id,&digest,message',
        sessionError: '[sessionId+errorId],*sessionId,*errorId'
      });
    };
    return Database;
  }(_dexie.Dexie);
  return Database;
});
//# sourceMappingURL=database.js.map