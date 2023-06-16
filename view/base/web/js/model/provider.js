/*eslint-disable */
/* jscs:disable */
define(["mageUtils", "underscore", "uiComponent", "VMPL_BugReplay/js/lib/recorder-manager", "VMPL_BugReplay/js/lib/items-paginator"], function (_mageUtils, _underscore, _uiComponent, _recorderManager, _itemsPaginator) {
  // @ts-ignore
  var _default = _uiComponent.extend({
    defaults: {
      fileHash: 'BugReplay',
      ignoreTmpls: {
        data: true
      },
      modules: {
        player: 'player'
      }
    },
    initialize: function initialize(options) {
      var _this = this;
      this._super(options);
      var manager = this._manager().then(function (manager) {
        if (!_this.player()) {
          manager.startRecord();
        }
        _this.exposeDemoActions(manager);
        return manager;
      });
      this._set('manager', function () {
        return manager;
      });
      return this;
    },
    _manager: function _manager() {
      return _recorderManager.init('/vmpl-bug-report/worker/loader', this.fileHash);
    },
    set: function set(path, value) {
      var _this2 = this;
      if (value instanceof Array) {
        var _this$get;
        Object.keys((_this$get = this.get(path)) != null ? _this$get : {}).filter(function (index) {
          return ~~index >= value.length;
        }).forEach(function (index) {
          return _this2.remove(path + "." + index);
        });
        for (var index in value) {
          this.set(path + "." + index, value[index]);
        }
        return this;
      }

      // @docs prevents the loop of the same item
      if (!(value.$$primary instanceof Function)) {
        return this._super(path, value);
      }
      var data = this.get(path);
      var diffs = !(data instanceof Function) && !this.isTracked(data) && (data == null ? void 0 : data.$$primary()) !== value.$$primary() ? _mageUtils.compare(data, value, path) : false;
      this._set(path, value);
      if (diffs) {
        this._notifyChanges(diffs);
      }
      return this;
    },
    _set: function _set(path, value) {
      var pathComponent,
        parent = this;
      var pathComponents = path.split('.');
      var lastPathComponent = pathComponents.pop();
      while (pathComponent = pathComponents.shift()) {
        if (!_underscore.isObject(parent[pathComponent])) {
          parent[pathComponent] = {};
        }
        parent = parent[pathComponent];
      }
      if (_underscore.isFunction(parent[lastPathComponent])) {
        parent[lastPathComponent](value);
      } else {
        parent[lastPathComponent] = value;
      }
    },
    exposeDemoActions: function exposeDemoActions(manager) {
      var range = function range(from, to) {
        var range = [];
        for (var i = from; i < to; i++) {
          range.push(i);
        }
        return range;
      };

      // @ts-ignore
      window.demo = {
        startRecord: function startRecord() {
          manager.startRecord();
        },
        getSessionRecords: function getSessionRecords() {
          manager.paginator.forEach(function (item) {
            console.log(item);
          });
        },
        goForPage: function goForPage(value) {
          return manager.paginator.page = value;
        },
        addFilterWithTitle: function addFilterWithTitle(title) {
          if (title === void 0) {
            title = 'Jackets - Tops - Women';
          }
          manager.paginator.filter = new _itemsPaginator.PaginatorFilter('title', title);
        },
        getTwoFirstSessionEvents: function getTwoFirstSessionEvents(from, to) {
          if (from === void 0) {
            from = 0;
          }
          if (to === void 0) {
            to = 2;
          }
          Promise.all(range(from, to).map(function (it) {
            return manager.paginator.fetch(it);
          })).then(function (sessions) {
            return manager.getEventsForSessionAt(sessions);
          }).then(function (events) {
            return console.log(events);
          });
        },
        uploadSessions: function uploadSessions() {
          manager.paginator.all().then(function (sessions) {
            return manager.uploadSessions(sessions);
          }).then(function () {
            return console.log('finished');
          });
        },
        deleteFirstSession: function deleteFirstSession() {
          manager.deleteAt(0).then(function () {
            return console.log('deleted');
          });
        },
        deleteAllSessions: function deleteAllSessions() {
          manager.paginator.forEach(function (item, index) {
            manager.deleteAt(index);
          }).then(function () {
            return console.log('deletedAll');
          });
        }
      };
    }
  });
  return _default;
});
//# sourceMappingURL=provider.js.map