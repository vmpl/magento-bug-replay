/*eslint-disable */
/* jscs:disable */
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
define(["VMPL_BugReplay/js/lib/items-paginator", "VMPL_BugReplay/js/lib/worker/client"], function (_itemsPaginator, _client) {
  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
  var DataEvent = /*#__PURE__*/function (_Event) {
    "use strict";

    _inheritsLoose(DataEvent, _Event);
    function DataEvent() {
      return _Event.apply(this, arguments) || this;
    }
    DataEvent.NewSessionWithError = function NewSessionWithError(sessionId) {
      var instance = new this(DataEvent.Types.NewSessionWithError, {
        bubbles: false,
        cancelable: false
      });
      instance.data = sessionId;
      return instance;
    };
    DataEvent.UploadSessionFinished = function UploadSessionFinished(sessions) {
      var instance = new this(DataEvent.Types.UploadSessionFinished, {
        bubbles: false,
        cancelable: false
      });
      instance.data = sessions;
      return instance;
    };
    _createClass(DataEvent, null, [{
      key: "Types",
      get: function get() {
        return {
          NewSessionWithError: 'vmpl-new-session-with-error',
          UploadSessionFinished: 'vmpl-upload-session-finished'
        };
      }
    }]);
    return DataEvent;
  }( /*#__PURE__*/_wrapNativeSuper(Event));
  var RecorderManager = /*#__PURE__*/function () {
    "use strict";

    function RecorderManager(sessionWorker) {
      this.sessionWorker = sessionWorker;
      this.paginator = new _itemsPaginator([], this);
    }
    var _proto = RecorderManager.prototype;
    _proto.startRecord = function startRecord() {
      (function (self) {
        self.stopRecord = rrwebRecord({
          emit: function emit(event) {
            self.sessionWorker.post(event).then(function (sessionId) {
              if (sessionId === 0) {
                return;
              }
              window.dispatchEvent(DataEvent.NewSessionWithError(sessionId));
            });
          },
          plugins: [rrwebConsoleRecord.getRecordConsolePlugin()]
        });
      })(this);
    };
    RecorderManager.init = function init(endpoint, instance) {
      if (instance === void 0) {
        instance = 'BugReplay';
      }
      var urlWorker = new URL(location.origin);
      urlWorker.pathname = endpoint + "/VMPL_BugReplay/js/lib/session/worker";
      return (0, _client.WorkerClient)(urlWorker.toString()).then(function (sessionWorker) {
        return sessionWorker.initInstance(instance).then(function () {
          return new RecorderManager(sessionWorker);
        });
      });
    };
    _proto.downloadImport = function downloadImport(request) {
      var _this = this;
      return this.sessionWorker.import(request.toString()).then(function () {
        return _this;
      });
    };
    _proto.getEventsForSessionAt = function getEventsForSessionAt(sessions) {
      return this.sessionWorker.events(sessions).then(function (response) {
        return response.items;
      });
    };
    _proto.uploadSessions = function uploadSessions(sessions) {
      var _this2 = this;
      return this.sessionWorker.export(sessions).then(function () {
        return _this2.paginator.clear();
      }).then(function () {
        return window.dispatchEvent(DataEvent.UploadSessionFinished(sessions));
      }).then();
    };
    _proto.deleteAt = function deleteAt(at) {
      var _this3 = this;
      return this.paginator.fetch(at).then(function (session) {
        return _this3.delete([session]);
      });
    };
    _proto.delete = function _delete(sessions) {
      var _this4 = this;
      return this.sessionWorker.delete(sessions).then(function () {
        return _this4.paginator.clear();
      });
    };
    _proto.loadPaginatorItems = function loadPaginatorItems(offset, limit, filter) {
      return this.sessionWorker.sessions(offset, limit, filter);
    };
    _proto.session = function session(sessionId) {
      var filter = new _itemsPaginator.PaginatorFilter();
      filter.append(new _itemsPaginator.PaginatorFilter('id', sessionId));
      return this.sessionWorker.sessions(0, 1, filter).then(function (items) {
        return items.items.pop();
      });
    };
    return RecorderManager;
  }();
  return Object.assign(RecorderManager, {
    DataEvent: DataEvent
  });
});
//# sourceMappingURL=recorder-manager.js.map