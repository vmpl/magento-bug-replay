/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout", "VMPL_BugReplay/js/model/data", "VMPL_BugReplay/js/action/session-replay"], function (_uiComponent, _knockout, _data, _sessionReplay) {
  var _default = _uiComponent.extend({
    list: _knockout.observableArray([]),
    dynamicLoad: function dynamicLoad() {
      var _this = this;
      return _data.manager.then(function (manager) {
        return manager.paginator.getPage();
      }).then(function (items) {
        var _this$list;
        return (_this$list = _this.list).push.apply(_this$list, items);
      });
    },
    sessionReplay: _sessionReplay
  });
  return _default;
});
//# sourceMappingURL=list.js.map