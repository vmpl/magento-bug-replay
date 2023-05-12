/*eslint-disable */
/* jscs:disable */
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
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
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
    deserialize: deserialize
  };
});
//# sourceMappingURL=worker-class.js.map