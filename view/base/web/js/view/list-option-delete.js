/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "uiRegistry", "VMPL_BugReplay/js/model/data"], function (_uiComponent, _uiRegistry, _data) {
  var _default = _uiComponent.extend({
    defaults: {
      template: 'VMPL_BugReplay/player/list/item/option',
      text: '🗑'
    },
    onClick: function onClick() {
      var parentName = this.parentName.split('.');
      parentName.pop();
      return _uiRegistry.promise(parentName.join('.')).then(function (component) {
        return _data.manager.then(function (manager) {
          return manager.delete([component.item]);
        });
      });
    }
  });
  return _default;
});
//# sourceMappingURL=list-option-delete.js.map