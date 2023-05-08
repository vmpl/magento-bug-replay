/*eslint-disable */
/* jscs:disable */
define(["threads/worker", "VMPL_BugReplay/js/api/session", "VMPL_BugReplay/js/lib/session-database"], function (_worker, _session, _sessionDatabase) {
  "use strict";

  _sessionDatabase = _interopRequireDefault(_sessionDatabase);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  var SessionWorker = /*#__PURE__*/function () {
    function SessionWorker() {}
    var _proto = SessionWorker.prototype;
    _proto.exportToObject = function exportToObject() {
      return {
        initInstance: this.initInstance.bind(this),
        post: this.post.bind(this),
        sessions: this.sessions.bind(this)
      };
    };
    _proto.initInstance = function initInstance(instance) {
      this.database = new _sessionDatabase.default(instance);
      return Promise.resolve();
    };
    _proto.post = function post(event) {
      return this.database.postRecord(event).then(function () {
        return true;
      });
    };
    _proto.sessions = function sessions(offset, limit) {
      if (offset === void 0) {
        offset = 0;
      }
      return this.database.getFullSnapshotsWithMeta().then(function (items) {
        var sessions = [];
        items.splice(offset * 2, limit * 2).reduce(function (accumulator, currentValue) {
          var _accumulator$pop;
          var snapshotMeta = (_accumulator$pop = accumulator.pop()) != null ? _accumulator$pop : {
            snapshot: null,
            meta: null
          };
          if (snapshotMeta.meta !== null && snapshotMeta.snapshot !== null) {
            accumulator.push(snapshotMeta);
            snapshotMeta = {
              snapshot: null,
              meta: null
            };
          }
          switch (true) {
            case currentValue.type === _session.EventType.Meta && snapshotMeta.meta === null:
              snapshotMeta.meta = currentValue;
              break;
            case currentValue.type === _session.EventType.FullSnapshot && snapshotMeta.snapshot === null:
              snapshotMeta.snapshot = currentValue;
              break;
            default:
              break;
          }
          accumulator.push(snapshotMeta);
          return accumulator;
        }, []).filter(function (it) {
          return !(it.meta === null || it.snapshot === null);
        }).forEach(function (snapshotMeta) {
          var _tagMetaTitle$attribu, _tagMetaTitle$attribu2;
          var tagMetaTitle = snapshotMeta.snapshot.data.node.childNodes.find(function (it) {
            return it.tagName === 'html';
          }).childNodes.find(function (it) {
            return it.tagName === 'head';
          }).childNodes.find(function (it) {
            var _it$attributes;
            return ((_it$attributes = it.attributes) == null ? void 0 : _it$attributes.name) === 'title';
          });
          sessions.push({
            timestamp: snapshotMeta.meta.timestamp,
            href: snapshotMeta.meta.data.href,
            title: (_tagMetaTitle$attribu = tagMetaTitle == null ? void 0 : (_tagMetaTitle$attribu2 = tagMetaTitle.attributes) == null ? void 0 : _tagMetaTitle$attribu2.content) != null ? _tagMetaTitle$attribu : 'Unknown'
          });
        });
        return sessions;
      });
    };
    return SessionWorker;
  }();
  var sessionWorker = new SessionWorker();
  (0, _worker.expose)(sessionWorker.exportToObject());
});
//# sourceMappingURL=session-worker.js.map