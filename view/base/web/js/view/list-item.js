/*eslint-disable */
/* jscs:disable */
define(["uiComponent"], function (_uiComponent) {
  var _default = _uiComponent.extend({
    defaults: {
      template: 'VMPL_BugReplay/player/list/item'
      // @bug for some reason it doesn't get set to the component, yet links works properly
      // exports: {
      //     onItemClick: '${ $.provider }:onItemClick'
      // },
      // links: {
      //     idActive: '${ $.provider }:idActive',
      // },
    }
  });
  return _default;
});
//# sourceMappingURL=list-item.js.map