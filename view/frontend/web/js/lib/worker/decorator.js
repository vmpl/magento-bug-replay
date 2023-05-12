/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define([], function () {
  function workerArgument(module) {
    return function (target) {
      return /*#__PURE__*/function (_target) {
        "use strict";

        _inheritsLoose(_class2, _target);
        function _class2() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _target.call.apply(_target, [this].concat(args)) || this;
          _this.$$classModule = module + ";" + target.name;
          return _this;
        }
        return _class2;
      }(target);
    };
  }
  return {
    workerArgument: workerArgument
  };
});
//# sourceMappingURL=decorator.js.map