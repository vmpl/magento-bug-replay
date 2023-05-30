/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/recorder-manager", "VMPL_BugReplay/js/lib/items-paginator"], function (_recorderManager, _itemsPaginator) {
  var Runner = /*#__PURE__*/function () {
    "use strict";

    function Runner(manager) {
      this.manager = manager;
    }
    var _proto = Runner.prototype;
    _proto.execute = function execute() {
      this.manager.startRecord();
      this.exposeDemoActions();
    };
    _proto.exposeDemoActions = function exposeDemoActions() {
      var _this = this;
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
          _this.manager.startRecord();
        },
        getSessionRecords: function getSessionRecords() {
          _this.manager.paginator.forEach(function (item) {
            console.log(item);
          });
        },
        goForPage: function goForPage(value) {
          return _this.manager.paginator.page = value;
        },
        addFilterWithTitle: function addFilterWithTitle(title) {
          if (title === void 0) {
            title = 'Jackets - Tops - Women';
          }
          _this.manager.paginator.filter = new _itemsPaginator.PaginatorFilter('title', title);
        },
        getTwoFirstSessionEvents: function getTwoFirstSessionEvents(from, to) {
          if (from === void 0) {
            from = 0;
          }
          if (to === void 0) {
            to = 2;
          }
          Promise.all(range(from, to).map(function (it) {
            return _this.manager.paginator.fetch(it);
          })).then(function (sessions) {
            return _this.manager.getEventsForSessionAt(sessions);
          }).then(function (events) {
            return console.log(events);
          });
        },
        uploadSessions: function uploadSessions() {
          _this.manager.paginator.all().then(function (sessions) {
            return _this.manager.uploadSessions(sessions);
          }).then(function () {
            return console.log('finished');
          });
        },
        deleteFirstSession: function deleteFirstSession() {
          _this.manager.deleteAt(0).then(function () {
            return console.log('deleted');
          });
        },
        deleteAllSessions: function deleteAllSessions() {
          _this.manager.paginator.forEach(function (item, index) {
            _this.manager.deleteAt(index);
          }).then(function () {
            return console.log('deletedAll');
          });
        }
      };
    };
    return Runner;
  }();
  var runner = _recorderManager.init().then(function (manager) {
    return new Runner(manager);
  });
  var _default = runner;
  return _default;
});
//# sourceMappingURL=runner.js.map