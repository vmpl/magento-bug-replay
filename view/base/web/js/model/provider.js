/*eslint-disable */
/* jscs:disable */
define(["mageUtils", "underscore", "uiComponent"], function (_mageUtils, _underscore, _uiComponent) {
  // @ts-ignore
  var _default = _uiComponent.extend({
    defaults: {
      ignoreTmpls: {
        data: true
      }
    },
    set: function set(path, value) {
      var _this = this;
      if (value instanceof Array) {
        var _this$get;
        Object.keys((_this$get = this.get(path)) != null ? _this$get : {}).filter(function (index) {
          return ~~index >= value.length;
        }).forEach(function (index) {
          return _this.remove(path + "." + index);
        });
        for (var index in value) {
          this.set(path + "." + index, value[index]);
        }
        return this;
      }

      // @docs prevents the loop of the same item
      if (!(value.$$primary instanceof Function)) {
        return this._super(path, value);
      }
      var data = this.get(path);
      var diffs = !(data instanceof Function) && !this.isTracked(data) && (data == null ? void 0 : data.$$primary()) !== value.$$primary() ? _mageUtils.compare(data, value, path) : false;
      this._set(path, value);
      if (diffs) {
        this._notifyChanges(diffs);
      }
      return this;
    },
    _set: function _set(path, value) {
      var pathComponent,
        parent = this;
      var pathComponents = path.split('.');
      var lastPathComponent = pathComponents.pop();
      while (pathComponent = pathComponents.shift()) {
        if (!_underscore.isObject(parent[pathComponent])) {
          parent[pathComponent] = {};
        }
        parent = parent[pathComponent];
      }
      if (_underscore.isFunction(parent[lastPathComponent])) {
        parent[lastPathComponent](value);
      } else {
        parent[lastPathComponent] = value;
      }
    }
  });
  return _default;
});
//# sourceMappingURL=provider.js.map