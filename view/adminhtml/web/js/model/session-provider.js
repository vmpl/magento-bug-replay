/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/model/provider", "VMPL_BugReplay/js/lib/recorder-manager"], function (_provider, _recorderManager) {
  var _default = _provider.extend({
    defaults: {
      fileHash: 'AdminReplay',
      fileRequestUrl: '',
      endpointRequest: ''
    },
    _manager: function _manager() {
      var _this = this;
      var endpoint = new URL(this.endpointRequest).pathname.replace(/\/+$/, '');
      if (this.fileHash === 'AdminReplay') {
        return _recorderManager.init(endpoint, this.fileHash); // @bug for some reason _super() doesn't work ??
      }

      return indexedDB.databases().then(function (databases) {
        if (databases.some(function (it) {
          return it.name === _this.fileHash;
        })) {
          return _recorderManager.init(endpoint, _this.fileHash);
        }
        return _recorderManager.init(endpoint, _this.fileHash).then(function (manager) {
          return manager.downloadImport(new URL(_this.fileRequestUrl));
        });
      });
    }
  });
  return _default;
});
//# sourceMappingURL=session-provider.js.map