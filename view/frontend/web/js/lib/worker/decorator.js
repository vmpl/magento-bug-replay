/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define([], function () {
  function WorkerArgument(module) {
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
  function WorkerSerializable(serializer) {
    return function (target) {
      return /*#__PURE__*/function (_target2) {
        "use strict";

        _inheritsLoose(_class3, _target2);
        function _class3() {
          return _target2.apply(this, arguments) || this;
        }
        var _proto = _class3.prototype;
        _proto.$$serialize = function $$serialize() {
          return Object.fromEntries(Object.entries(this).map(function (_ref) {
            var property = _ref[0],
              value = _ref[1];
            if (value instanceof Function) {
              return null;
            }
            if (!serializer.hasOwnProperty(property)) {
              return [property, value];
            }
            var _serializer$property = serializer[property],
              serialize = _serializer$property[0];
            return [property, serialize(value)];
          }).filter(function (it) {
            return it !== null;
          }));
        };
        _class3.$$deserialize = function $$deserialize(data) {
          var deserializeObject = Object.fromEntries(Object.entries(data).map(function (_ref2) {
            var property = _ref2[0],
              value = _ref2[1];
            if (!serializer.hasOwnProperty(property)) {
              return [property, value];
            }
            var _serializer$property2 = serializer[property],
              serialize = _serializer$property2[0],
              deserialize = _serializer$property2[1];
            return [property, deserialize(value)];
          }));
          return Object.assign(new this(), deserializeObject);
        };
        return _class3;
      }(target);
    };
  }
  return {
    WorkerArgument: WorkerArgument,
    WorkerSerializable: WorkerSerializable
  };
});
//# sourceMappingURL=decorator.js.map