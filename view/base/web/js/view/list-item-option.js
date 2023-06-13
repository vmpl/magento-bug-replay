/*eslint-disable */
/* jscs:disable */
define(["uiComponent"], function (_uiComponent) {
  var _default = _uiComponent.extend({
    defaults: {
      template: 'VMPL_BugReplay/player/list/item/option',
      itemProvider: "${ $.parentName.split('.').slice(0, -1).join('.') }",
      provider: "${ $.parentName.split('.').slice(0, -2).join('.') }",
      imports: {
        item: '${ $.itemProvider }:item'
      }
    }
  });
  return _default;
});
//# sourceMappingURL=list-item-option.js.map