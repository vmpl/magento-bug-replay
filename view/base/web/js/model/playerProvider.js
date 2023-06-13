/*eslint-disable */
/* jscs:disable */
define(["mageUtils", "uiComponent"], function (_mageUtils, _uiComponent) {
  // @ts-ignore
  var _default = _uiComponent.extend({
    defaults: {
      ignoreTmpls: {
        data: true
      }
    },
    setData: function setData(oldData, newData, current, parentPath) {
      var _this = this;
      Object.entries(oldData).forEach(function (_ref) {
        var key = _ref[0],
          val = _ref[1];
        switch (true) {
          case val instanceof Array:
          case val instanceof Object:
            _this.setData(oldData[key], val, current[key], _mageUtils.fullPath(parentPath, key));
            break;
          case val != oldData[key] && oldData[key] == current[key]:
            _this.set(_mageUtils.fullPath(parentPath, key), val);
            break;
          default:
            break;
        }
      });
    }
  });
  return _default;
});
//# sourceMappingURL=playerProvider.js.map