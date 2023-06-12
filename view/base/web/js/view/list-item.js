/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout"], function (_uiComponent, _knockout) {
  var _default = _uiComponent.extend({
    activeSession: _knockout.observable(),
    defaults: {
      template: 'VMPL_BugReplay/player/list/item',
      imports: {
        item: '${ $.provider }:sessions.${ $.itemIndex }'
      },
      links: {
        activeSession: '${ $.provider }:activeSession'
      }
    },
    initObservable: function initObservable() {
      var _this = this;
      this._super();
      this.isActive = _knockout.pureComputed(function () {
        return _this.activeSession().id === _this.item.id;
      }, this);
      return this;
    },
    afterRender: function afterRender(element) {
      // @todo hammer manager
    }
  });
  return _default;
});
//# sourceMappingURL=list-item.js.map