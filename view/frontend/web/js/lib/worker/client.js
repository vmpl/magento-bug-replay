/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
define(["VMPL_BugReplay/js/lib/worker/converter", "uuid"], function (_converter, _uuid) {
  var ClientEvent = /*#__PURE__*/function (_Event) {
    "use strict";

    _inheritsLoose(ClientEvent, _Event);
    function ClientEvent(type, data, eventInitDict) {
      var _this;
      _this = _Event.call(this, type, eventInitDict) || this;
      _this.data = data;
      return _this;
    }
    return ClientEvent;
  }( /*#__PURE__*/_wrapNativeSuper(Event));
  var Client = /*#__PURE__*/function () {
    "use strict";

    function Client(worker, dispatcher) {
      if (dispatcher === void 0) {
        dispatcher = new EventTarget();
      }
      this.worker = worker;
      this.dispatcher = dispatcher;
      this.worker.addEventListener('message', this.onMessage.bind(this));
    }
    Client.init = function init(worker) {
      var instance = new Client(worker);
      return new Promise(function (resolve) {
        instance.dispatcher.addEventListener('$$init', function (event) {
          var entries = event.data.map(function (method) {
            return [method, function () {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              return instance.postMessage(method, args);
            }];
          });
          resolve(Object.fromEntries(entries));
        }, {
          once: true
        });
      });
    };
    var _proto = Client.prototype;
    _proto.onMessage = function onMessage(event) {
      var _this2 = this;
      _converter.objectToClass(event.data.result).then(function (result) {
        return new ClientEvent(event.data.id, result);
      }).then(function (event) {
        return _this2.dispatcher.dispatchEvent(event);
      });
    };
    _proto.postMessage = function postMessage(method, args) {
      var _this3 = this;
      var id = (0, _uuid.v4)();
      Promise.all(args.map(_converter.classToObject.bind(_converter))).then(function (resolved) {
        return _this3.worker.postMessage({
          id: id,
          method: method,
          arguments: resolved
        });
      });
      return new Promise(function (resolve) {
        _this3.dispatcher.addEventListener(id, function (event) {
          resolve(event.data);
        }, {
          once: true
        });
      });
    };
    return Client;
  }();
  function WorkerClient(scriptUrl) {
    return Client.init(new Worker(scriptUrl)).then(function (client) {
      return client;
    });
  }
  return {
    WorkerClient: WorkerClient
  };
});
//# sourceMappingURL=client.js.map