/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/api/session", "VMPL_BugReplay/js/lib/session/database", "VMPL_BugReplay/js/lib/worker/consumer", "VMPL_BugReplay/js/lib/session/models"], function (_session, _database, _consumer, _models) {
  "use strict";

  _database = _interopRequireDefault(_database);
  var _dec, _class;
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  var Worker = (_dec = (0, _consumer.WorkerConsumer)(), _dec(_class = /*#__PURE__*/function () {
    function Worker() {}
    var _proto = Worker.prototype;
    _proto.initInstance = function initInstance(instance) {
      this.database = new _database.default(instance);
      return Promise.resolve();
    };
    _proto.post = function post(event) {
      return this.database.postRecord(event).then(function () {
        return true;
      });
    };
    _proto.sessions = function sessions(offset, limit, filter) {
      if (offset === void 0) {
        offset = 0;
      }
      return this.database.getFullSnapshotsWithMeta().then(function (items) {
        var _filter$match;
        var sessions = [];
        items.reduce(function (accumulator, currentValue) {
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
          sessions.push(new _models.RecordSession(new URL(snapshotMeta.meta.data.href), (_tagMetaTitle$attribu = tagMetaTitle == null ? void 0 : (_tagMetaTitle$attribu2 = tagMetaTitle.attributes) == null ? void 0 : _tagMetaTitle$attribu2.content) != null ? _tagMetaTitle$attribu : 'Unknown', new Date(snapshotMeta.meta.timestamp)));
        });
        sessions = (_filter$match = filter == null ? void 0 : filter.match(sessions)) != null ? _filter$match : sessions;
        return {
          meta: {
            totalRecords: sessions.length
          },
          items: sessions.slice(offset, limit)
        };
      });
    };
    _proto.events = function events(sessions) {
      var _this = this;
      return Promise.all(sessions.map(function (session) {
        return _this.database.getEvents(session.timestamp.getTime());
      })).then(function (events) {
        var _ref;
        var items = (_ref = []).concat.apply(_ref, events);
        // @ts-ignore
        items.sort(function (a, b) {
          return a.timestamp > b.timestamp;
        });
        return {
          items: items,
          meta: {
            totalRecords: items.length
          }
        };
      });
    };
    return Worker;
  }()) || _class);
  new Worker();
});
//# sourceMappingURL=worker.js.map