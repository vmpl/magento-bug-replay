/*eslint-disable */
/* jscs:disable */
define(["mageUtils", "underscore", "uiComponent", "VMPL_BugReplay/js/bug-replay/recorder-manager"], function (_mageUtils, _underscore, _uiComponent, _recorderManager) {
  // @ts-ignore
  var _default = _uiComponent.extend({
    defaults: {
      fileHash: 'BugReplay',
      endpointRequest: '/vmpl-bug-replay/worker/loader',
      ignoreTmpls: {
        data: true
      }
    },
    initialize: function initialize(options) {
      this._super(options);
      this.get('$recordEnable') !== undefined || this.set('$recordEnable', this.get('configuration.enabled') === '1' ? '1' : '0');
      this.get('$reportEnable') !== undefined || this.set('$reportEnable', this.get('configuration.report') === '1' ? '1' : '0');
      var manager = this._manager();
      this._set('manager', function () {
        return manager;
      });
      return this;
    },
    _manager: function _manager() {
      var _this = this;
      return _recorderManager.init(this.endpointRequest, this.fileHash).then(function (manager) {
        !_this.shouldRecord() || manager.startRecord();
        return manager;
      });
    },
    get: function get(path) {
      if (path.startsWith('$')) {
        return this.storage().get(path.replace(/^\$/, ''));
      }
      if (path.startsWith('!')) {
        return !JSON.parse(this._super(path.replace(/^!/, '')));
      }
      return this._super(path);
    },
    set: function set(path, value) {
      var _this2 = this;
      if (value instanceof Array) {
        var _this$get;
        Object.keys((_this$get = this.get(path)) != null ? _this$get : {}).filter(function (index) {
          return ~~index >= value.length;
        }).forEach(function (index) {
          return _this2.remove(path + "." + index);
        });
        for (var index in value) {
          this.set(path + "." + index, value[index]);
        }
        return this;
      }
      var data = this.get(path);
      var shouldDiff = !(data instanceof Function) && !this.isTracked(data);
      shouldDiff = shouldDiff && value.$$primary instanceof Function ? (data == null ? void 0 : data.$$primary()) !== value.$$primary() : true;
      var diffs = shouldDiff ? _mageUtils.compare(data, value, path) : false;
      this._set(path, value);
      if (diffs) {
        this._notifyChanges(diffs);
      }
      return this;
    },
    _set: function _set(path, value) {
      if (path.startsWith('$')) {
        return this.storage().set(path.replace(/^\$/, ''), value);
      }
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
    },
    shouldRecord: function shouldRecord() {
      var shouldRecord = this.get('configuration.available') === '1';
      shouldRecord && (shouldRecord = this.get('configuration.enable_toggle') === '0' && this.get('configuration.enabled') === '1' || this.get('configuration.enable_toggle') === '1' && this.get('$recordEnable') === '1');
      return shouldRecord;
    },
    shouldReport: function shouldReport() {
      var shouldReport = this.get('configuration.available') === '1';
      shouldReport && (shouldReport = this.get('configuration.report_toggle') === '0' && this.get('configuration.report') === '1' || this.get('configuration.report_toggle') === '1' && this.get('$reportEnable') === '1');
      return shouldReport;
    }
  });
  return _default;
});
//# sourceMappingURL=provider.js.map