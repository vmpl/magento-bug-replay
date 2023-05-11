/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define([], function () {
  var deserialize = new Map();
  function randomstring(length) {
    if (length === void 0) {
      length = 64;
    }
    var outString = '';
    var inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    return outString;
  }
  function injectableArgument(module) {
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
          _this.$$classModule = module + "::" + target.name;
          return _this;
        }
        return _class2;
      }(target);
    };
  }
  function exportToObject(target, propertyName, descriptor) {
    if (!target.hasOwnProperty('$exportMethods')) {
      Object.defineProperty(target, '$exportMethods', {
        value: [],
        configurable: false,
        enumerable: true,
        writable: false
      });
    }
    if (!target.hasOwnProperty('$exportObject')) {
      Object.defineProperty(target, '$exportObject', {
        value: function value() {
          var exportObject = {};
          target['$exportMethods'].forEach(function (method) {
            exportObject[method] = target[method].bind(target);
          });
          return exportObject;
        },
        configurable: false,
        enumerable: false,
        writable: false
      });
    }
    target['$exportMethods'].push(propertyName);
    var parentMethod = descriptor.value;
    descriptor.value = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return parentMethod.apply(this, args.map(function (argument) {
        if (argument.hasOwnProperty('$$classModule')) {
          console.log('$$classModule');
        }
        return argument;
      }));
    };
  }
  return {
    exportToObject: exportToObject,
    injectableArgument: injectableArgument,
    deserialize: deserialize
  };
});
//# sourceMappingURL=worker-class.js.map