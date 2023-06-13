/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["mageUtils"], function (_mageUtils) {
  // @ts-ignore

  function _default(path) {
    return function (target) {
      return /*#__PURE__*/function (_target) {
        "use strict";

        _inheritsLoose(_class, _target);
        function _class() {
          return _target.apply(this, arguments) || this;
        }
        var _proto = _class.prototype;
        _proto.$$primary = function $$primary() {
          var _mageUtils$nested;
          return (_mageUtils$nested = _mageUtils.nested(this, path)) != null ? _mageUtils$nested : this;
        };
        return _class;
      }(target);
    };
  }
  return _default;
});
//# sourceMappingURL=primary.js.map