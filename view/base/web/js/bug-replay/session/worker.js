/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/api/session", "VMPL_BugReplay/js/bug-replay/session/database", "VMPL_BugReplay/js/lib/worker/consumer", "axios", "VMPL_BugReplay/js/bug-replay/session/model/record-session", "VMPL_BugReplay/js/bug-replay/session/model/error-console"], function (_session, _database, _consumer, _axios, _recordSession, _errorConsole) {
  "use strict";

  _database = _interopRequireDefault(_database);
  _axios = _interopRequireDefault(_axios);
  _errorConsole = _interopRequireDefault(_errorConsole);
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
      return (event.type <= 2 ? this.flushBuffer() : Promise.resolve(0)).then(function (sessionId) {
        return _this.database.buffer.put(event).then(function () {
          return sessionId;
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
        return _axios.default.post('/vmpl-bug-replay/session/upload', body).then(function (response) {
          return response.data;
        });
      }).then(function (_ref) {
        var fileName = _ref.fileName;
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
      var sessionError = this.database.table('sessionError');
      return this.database.transaction('rw', [this.database.events, this.database.sessions, this.database.errors, sessionError], function () {
        return sessionError.where('sessionId').anyOf(sessionIds).toArray().then(function (items) {
          return Promise.all([_this4.database.sessions.bulkDelete(sessionIds), _this4.database.events.where('sessionId').anyOf(sessionIds).delete(), _this4.database.errors.bulkDelete(items.map(function (it) {
            return it.errorId;
          })), sessionError.where('sessionId').anyOf(sessionIds).delete()]);
        }).then();
      });
    }

    /**
     * @private
     * @return number when buffer has event with error in the console otherwise zero
     */;
    _proto.flushBuffer = function flushBuffer() {
      var _this5 = this;
      return Promise.all([this.database.buffer.where('type').equals(_session.EventType.Meta).first(), this.database.buffer.where('type').equals(_session.EventType.FullSnapshot).first(), this.createBufferErrorDigests()]).then(function (_ref2) {
        var meta = _ref2[0],
          snapshot = _ref2[1],
          errorConsoles = _ref2[2];
        var tagMetaTitle = snapshot == null ? void 0 : snapshot.data.node.childNodes.find(function (it) {
          return (it == null ? void 0 : it.tagName) === 'html';
        }).childNodes.find(function (it) {
          return (it == null ? void 0 : it.tagName) === 'head';
        }).childNodes.find(function (it) {
          var _it$attributes;
          return (it == null ? void 0 : (_it$attributes = it.attributes) == null ? void 0 : _it$attributes.name) === 'title';
        });
        var sessionError = _this5.database.table('sessionError');
        return _this5.database.transaction('rw', [_this5.database.buffer, _this5.database.events, _this5.database.sessions, _this5.database.errors, sessionError], function () {
          var _tagMetaTitle$attribu, _tagMetaTitle$attribu2;
          return Promise.all([_this5.database.sessions.put({
            href: meta.data.href,
            title: (_tagMetaTitle$attribu = tagMetaTitle == null ? void 0 : (_tagMetaTitle$attribu2 = tagMetaTitle.attributes) == null ? void 0 : _tagMetaTitle$attribu2.content) != null ? _tagMetaTitle$attribu : 'Unknown',
            timestamp: meta.timestamp
          }), _this5.database.errors.bulkPut(errorConsoles.filter(function (it) {
            return !it.id;
          }), {
            allKeys: true
          })]).then(function (_ref3) {
            var sessionId = _ref3[0],
              errorKeys = _ref3[1];
            var errorIds = errorKeys.map(function (it) {
              return ~~it;
            });
            errorIds.push.apply(errorIds, errorConsoles.filter(function (it) {
              return !!it.id;
            }).map(function (it) {
              return it.id;
            }));
            return Promise.all([sessionError.bulkAdd(errorIds.map(function (errorId) {
              return {
                sessionId: sessionId,
                errorId: errorId
              };
            })), _this5.database.buffer.toArray().then(function (events) {
              return events.map(function (it) {
                it.sessionId = sessionId;
                return it;
              });
            }).then(function (events) {
              return _this5.database.events.bulkPut(events);
            })]).then(function () {
              return _this5.database.buffer.clear();
            }).then(function () {
              return !errorConsoles.length ? 0 : sessionId;
            });
          });
        });
      });
    };
    _proto.createBufferErrorDigests = function createBufferErrorDigests() {
      var _this6 = this;
      var textEncoder = new TextEncoder();
      var textDecoder = new TextDecoder();
      return this.database.buffer.where('type').equals(6).and(function (it) {
        return it.data.plugin.startsWith('rrweb/console') && it.data.payload.level === 'error';
      }).toArray().then(function (errorEvents) {
        return Promise.all(errorEvents.map(function (event) {
          return Promise.all([event, crypto.subtle.digest('SHA-1', textEncoder.encode(JSON.stringify(event.data.payload)))]);
        }));
      }).then(function (results) {
        var errorMap = new Map();
        results.forEach(function (_ref4) {
          var event = _ref4[0],
            digest = _ref4[1];
          errorMap.set(textDecoder.decode(digest), event);
        });
        return errorMap;
      }).then(function (digests) {
        return _this6.database.errors.where('digest').anyOf(Array.from(digests.keys())).toArray().then(function (consoleErrors) {
          digests.forEach(function (event, digest) {
            if (!consoleErrors.some(function (it) {
              return it.digest === digest;
            })) {
              consoleErrors.push(new _errorConsole.default(digest, event.data.payload.payload.shift()));
            }
          });
          return consoleErrors;
        });
      }).then(function (consoleErrors) {
        return _this6.database.table('sessionError').where('errorId').anyOf(consoleErrors.map(function (it) {
          return it.id;
        })).toArray().then(function (items) {
          return _this6.database.sessions.where('id').anyOf(items.map(function (it) {
            return it.sessionId;
          })).and(function (it) {
            return !!(it.uploaded && it.uploaded.length);
          }).toArray().then(function (sessions) {
            return items.filter(function (it) {
              return sessions.some(function (session) {
                return session.id == it.sessionId;
              });
            }).map(function (it) {
              return it.errorId;
            });
          });
        }).then(function (items) {
          return consoleErrors.filter(function (it) {
            return !items.includes(it.id);
          });
        });
      });
    };
    return Worker;
  }()) || _class);
  new Worker();
});
//# sourceMappingURL=worker.js.map