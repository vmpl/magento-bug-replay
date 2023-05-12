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
      // @ts-ignore
      window.demo = {
        getSessionRecords: function getSessionRecords() {
          _this.manager.paginator.getCurrentPage().then(function (items) {
            return console.log(items);
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
        getTwoFirstSessionEvents: function getTwoFirstSessionEvents() {
          _this.manager.paginator.getCurrentPage().then(function (sessions) {
            return _this.manager.getEventsForSessionAt(sessions.slice(0, 2));
          }).then(function (events) {
            return console.log(events);
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