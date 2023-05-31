/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "uiRegistry", "knockout"], function (_uiComponent, _uiRegistry, _knockout) {
  var _default = _uiComponent.extend({
    defaults: {
      template: 'VMPL_BugReplay/player/list/item/option-upload'
    },
    checked: _knockout.observable(false),
    onClick: function onClick() {
      var _this = this;
      var parentName = this.parentName.split('.');
      parentName.pop();
      return Promise.all([_uiRegistry.promise(parentName.join('.')), _uiRegistry.promise(this.provider)]).then(function (_ref) {
        var listComponent = _ref[0],
          selectProvider = _ref[1];
        _this.checked(!_this.checked());
        selectProvider.selectItem(listComponent.item, _this.checked());
      });
    }
  });
  return _default;
});
//# sourceMappingURL=list-option-upload.js.map