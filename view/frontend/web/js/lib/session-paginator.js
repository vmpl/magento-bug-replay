/*eslint-disable */
/* jscs:disable */
define([], function () {
  var _default = /*#__PURE__*/function () {
    "use strict";

    function _default(loadingItems) {
      this.page = 1;
      this.size = 20;
      this.items = [];
      this.loadingItems = loadingItems;
    }
    var _proto = _default.prototype;
    _proto.getCurrentPage = function getCurrentPage() {
      var _this = this;
      var offset = (this.page - 1) * this.size;
      var limit = this.size;
      if (offset >= this.items.length) {
        var leftChunk = this.items.slice(0, offset);
        var rightChunk = this.items.slice(offset + limit);
        return this.loadingItems(offset, limit).then(function (items) {
          _this.items = [].concat(leftChunk, items, rightChunk);
          return items;
        });
      }
      return Promise.resolve(this.items.slice(offset, limit));
    };
    _proto.goPage = function goPage(page) {
      if (!(page > 0)) {
        throw new Error('Page cannot be lower then 1.');
      }
      this.page = page;
    };
    _proto.goNext = function goNext() {
      this.goPage(this.page + 1);
    };
    _proto.goPrevious = function goPrevious() {
      if (this.page !== 1) {
        this.goPage(this.page - 1);
      }
    };
    return _default;
  }();
  return _default;
});
//# sourceMappingURL=session-paginator.js.map