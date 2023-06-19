/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/api/session", "VMPL_BugReplay/js/lib/session/database", "VMPL_BugReplay/js/lib/worker/consumer", "axios", "VMPL_BugReplay/js/lib/session/model/record-session"], function (_session, _database, _consumer, _axios, _recordSession) {
  "use strict";

  _database = _interopRequireDefault(_database);
  _axios = _interopRequireDefault(_axios);
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
      var _this = this;
      return Promise.all([this.database.buffer.where('type').equals(_session.EventType.Meta).count(), this.database.buffer.where('type').equals(_session.EventType.FullSnapshot).count()]).then(function (_ref) {
        var metaCount = _ref[0],
          snapshotCount = _ref[1];
        return metaCount === snapshotCount && snapshotCount === 0 ? Promise.resolve(0) : _this.flushBuffer();
      }).then(function (sessionId) {
        return _this.database.buffer.put(event).then(function () {
          return sessionId;
        }).catch(function (error) {
          throw error;
        });
      });
    };
    _proto.sessions = function sessions(offset, limit, filter) {
      if (offset === void 0) {
        offset = 0;
      }
      return this.database.sessions.orderBy('timestamp').reverse().toArray().then(filter.match.bind(filter)).then(function (sessions) {
        var count = sessions.length;
        return {
          items: sessions.slice(offset, offset + limit).map(function (it) {
            return new _recordSession.RecordSession(it.title, it.href, it.timestamp, it.id, it.uploaded);
          }),
          meta: {
            totalRecords: count
          }
        };
      });
    };
    _proto.events = function events(sessions) {
      var sessionsIds = sessions.map(function (it) {
        return it.id;
      }).filter(function (it) {
        return Number.isInteger(it);
      });
      return this.database.events.where('sessionId').anyOf(sessionsIds).toArray().then(function (events) {
        return {
          items: events,
          meta: {
            totalRecords: events.length
          }
        };
      });
    };
    _proto.export = function _export(sessions) {
      var _this2 = this;
      var sessionIds = sessions.filter(function (it) {
        return (it == null ? void 0 : it.id) && !(it != null && it.uploaded);
      }).map(function (it) {
        return it.id;
      });
      if (!sessionIds.length) {
        return Promise.resolve([]);
      }
      return this.database.export({
        filter: function filter(table, value, key) {
          switch (table) {
            case 'sessions':
              return sessionIds.includes(value.id);
            case 'events':
              return sessionIds.includes(value.sessionId);
            default:
              return false;
          }
        }
      }).then(function (blob) {
        var body = new FormData();
        body.append('database', new File([blob], 'database.json'), 'database.json');
        return _axios.default.post('/vmpl-bug-report/session/upload', body).then(function (response) {
          return response.data;
        });
      }).then(function (_ref2) {
        var fileName = _ref2.fileName;
        return Promise.all(sessionIds.map(function (id) {
          return _this2.database.sessions.update(id, {
            uploaded: fileName
          });
        }));
      });
    };
    _proto.import = function _import(url) {
      var _this3 = this;
      return _axios.default.get(url, {
        responseType: 'blob'
      }).then(function (response) {
        return _this3.database.import(response.data, {
          acceptNameDiff: true
        });
      });
    };
    _proto.delete = function _delete(sessions) {
      var _this4 = this;
      var sessionIds = sessions.map(function (it) {
        return it.id;
      }).filter(function (it) {
        return !!it;
      });
      return this.database.transaction('rw', [this.database.events, this.database.sessions], function () {
        return _this4.database.events.where('sessionId').anyOf(sessionIds).eachPrimaryKey(function (it) {
          return _this4.database.events.delete(it);
        }).then(function () {
          return _this4.database.sessions.bulkDelete(sessionIds);
        });
      });
    }

    /**
     * @private
     * @return number when buffer has event with error in the console otherwise zero
     */;
    _proto.flushBuffer = function flushBuffer() {
      var _this5 = this;
      return Promise.all([this.database.buffer.where('type').equals(_session.EventType.Meta).first(), this.database.buffer.where('type').equals(_session.EventType.FullSnapshot).first()]).then(function (_ref3) {
        var meta = _ref3[0],
          snapshot = _ref3[1];
        var tagMetaTitle = snapshot == null ? void 0 : snapshot.data.node.childNodes.find(function (it) {
          return (it == null ? void 0 : it.tagName) === 'html';
        }).childNodes.find(function (it) {
          return (it == null ? void 0 : it.tagName) === 'head';
        }).childNodes.find(function (it) {
          var _it$attributes;
          return (it == null ? void 0 : (_it$attributes = it.attributes) == null ? void 0 : _it$attributes.name) === 'title';
        });
        return _this5.database.transaction('rw', [_this5.database.buffer, _this5.database.events, _this5.database.sessions], function () {
          var _tagMetaTitle$attribu, _tagMetaTitle$attribu2;
          return _this5.database.sessions.put({
            href: meta.data.href,
            title: (_tagMetaTitle$attribu = tagMetaTitle == null ? void 0 : (_tagMetaTitle$attribu2 = tagMetaTitle.attributes) == null ? void 0 : _tagMetaTitle$attribu2.content) != null ? _tagMetaTitle$attribu : 'Unknown',
            timestamp: meta.timestamp
          }).catch(function (error) {
            throw error;
          }).then(function (sessionId) {
            return _this5.database.buffer.where('type').equals(6).and(function (it) {
              return it.data.plugin.startsWith('rrweb/console') && it.data.payload.level === 'error';
            }).first().then(function (errorEvent) {
              return _this5.database.buffer.toArray().then(function (events) {
                return events.map(function (it) {
                  it.sessionId = sessionId;
                  return it;
                });
              }).then(function (events) {
                return _this5.database.events.bulkPut(events);
              }).then(function () {
                return _this5.database.buffer.clear();
              }).then(function () {
                return errorEvent === undefined ? 0 : sessionId;
              });
            });
          });
        });
      });
    };
    return Worker;
  }()) || _class);
  new Worker();
});
//# sourceMappingURL=worker.js.map