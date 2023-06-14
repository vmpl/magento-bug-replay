/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/list-item-option"], function (_listItemOption) {
  var _default = _listItemOption.extend({
    defaults: {
      text: '🗑',
      imports: {
        manager: '${ $.provider }:manager'
      }
    },
    onClick: function onClick() {
      var _this = this;
      var thenManager = this.manager();
      return thenManager.then(function (manager) {
        return manager.delete([_this.item]);
      }).then(function () {
        return _this.source.reload();
      });
    }
  });
  return _default;
});
//# sourceMappingURL=list-option-delete.js.map