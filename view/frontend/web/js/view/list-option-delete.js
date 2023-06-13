/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/list-item-option", "VMPL_BugReplay/js/model/data"], function (_listItemOption, _data) {
  var _default = _listItemOption.extend({
    defaults: {
      text: '🗑'
    },
    onClick: function onClick() {
      var _this = this;
      return _data.manager.then(function (manager) {
        return manager.delete([_this.item]);
      }).then(function () {
        return _this.source.reload();
      });
    }
  });
  return _default;
});
//# sourceMappingURL=list-option-delete.js.map