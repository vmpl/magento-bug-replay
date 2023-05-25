/*eslint-disable */
/* jscs:disable */
define(["knockout"], function (_knockout) {
  var Session = /*#__PURE__*/function () {
    "use strict";

    function Session(list, manager) {
      if (list === void 0) {
        list = _knockout.observableArray([]);
      }
      this.list = list;
      this.manager = manager;
    }
    var _proto = Session.prototype;
    _proto.listNext = function listNext() {
      var _this = this;
      this.manager.paginator.getPage().then(function (items) {
        return _this.list.push(items);
      });
    };
    return Session;
  }();
  return Session;
});
//# sourceMappingURL=session.js.map