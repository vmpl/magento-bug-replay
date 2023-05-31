/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "uiRegistry", "VMPL_BugReplay/js/model/data"], function (_uiComponent, _uiRegistry, _data) {
  var _default = _uiComponent.extend({
    defaults: {
      template: 'VMPL_BugReplay/player/list/item/option',
      text: '🗑',
      imports: {
        item: '${ $.provider }:item'
      }
    },
    onClick: function onClick() {
      var parentName = this.parentName.split('.');
      parentName.pop();
      return _uiRegistry.promise(parentName.join('.')).then(function (component) {
        return component.item;
      }).then(function (item) {
        return _data.manager.then(function (manager) {
          return manager.delete([item]);
        });
      });
    }
  });
  return _default;
});
//# sourceMappingURL=list-option-delete.js.map