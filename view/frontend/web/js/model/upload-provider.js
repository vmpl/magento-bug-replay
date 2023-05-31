/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout"], function (_uiComponent, _knockout) {
  var _default = _uiComponent.extend({
    defaults: {
      ignoreTmpls: {
        data: true
      }
    },
    selected: _knockout.observableArray([]),
    selectItem: function selectItem(item, checked) {
      var exists = this.selected().some(function (it) {
        return it.id === item.id;
      });
      if (!exists && checked) {
        this.selected.push(item.id);
      } else if (exists && !checked) {
        this.selected.remove(item.id);
      }
    }
  });
  return _default;
});
//# sourceMappingURL=upload-provider.js.map