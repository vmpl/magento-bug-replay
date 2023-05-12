/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["VMPL_BugReplay/js/lib/worker/converter"], function (_converter) {
  function WorkerConsumer(namespace) {
    if (namespace === void 0) {
      namespace = null;
    }
    if (!WorkerGlobalScope) {
      throw new Error("Can only register on worker.");
    }
    return function (target) {
      return /*#__PURE__*/function (_target) {
        "use strict";

        _inheritsLoose(_class, _target);
        function _class() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _target.call(this, args) || this;
          _this.run();
          return _this;
        }
        var _proto = _class.prototype;
        _proto.$$messageHandler = function $$messageHandler(event) {
          var _this2 = this;
          if (!target.prototype.hasOwnProperty(event.data.method)) {
            return;
          }
          Promise.all(event.data.arguments.map(_converter.objectToClass.bind(_converter))).then(function (args) {
            return target.prototype[event.data.method].apply(_this2, args);
          }).then(function (result) {
            return postMessage(result);
          }).catch(function (error) {
            console.error(error);
            throw error;
          });
        };
        _proto.run = function run() {
          addEventListener('message', this.$$messageHandler.bind(this));
          var methods = Object.entries(Object.getOwnPropertyDescriptors(target.prototype)).filter(function (_ref) {
            var property = _ref[0],
              descriptor = _ref[1];
            return descriptor.value instanceof Function;
          }).map(function (_ref2) {
            var property = _ref2[0];
            return property;
          });
          postMessage({
            method: '$$init',
            arguments: methods
          });
        };
        return _class;
      }(target);
    };
  }
  return {
    WorkerConsumer: WorkerConsumer
  };
});
//# sourceMappingURL=consumer.js.map