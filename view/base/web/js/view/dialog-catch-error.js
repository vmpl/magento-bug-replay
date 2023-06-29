/*eslint-disable */
/* jscs:disable */
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
define(["VMPL_BugReplay/js/view/dialog", "VMPL_BugReplay/js/bug-replay/recorder-manager", "knockout"], function (_dialog, _recorderManager, _knockout) {
  var _default = _dialog.extend({
    defaults: {
      template: 'VMPL_BugReplay/dialog/catch-error',
      content: {
        title: 'Error Detected.',
        message: 'In previos sessions error was caught, the recording was saved on your browser memory.',
        preview: 'Preview',
        upload: 'Upload',
        close: 'Close'
      },
      elementConfig: {
        class: _knockout.observable('message info left-bottom')
      },
      imports: {
        manager: '${ $.provider }:manager',
        configurationIgnoreRules: '${ $.provider }:configuration.ignore_rules'
      }
    },
    initialize: function initialize(options) {
      this._super(options);
      this.ignoreRules = (this.configurationIgnoreRules || '').split('\n').map(function (it) {
        if (it === "") {
          return null;
        }
        var components = it.trim().split('/');
        try {
          return new RegExp(components.at(1), components.at(2));
        } catch (e) {
          return null;
        }
      }).filter(function (it) {
        return it !== null;
      });
      return this;
    },
    initObservable: function initObservable() {
      this._super();
      window.addEventListener(_recorderManager.DataEvent.Types.NewSessionWithError, this.onSessionError.bind(this));
      return this;
    },
    onSessionError: function onSessionError(event) {
      var _this = this;
      var result = event.data;
      result.errors = result.errors.filter(function (it) {
        for (var _iterator = _createForOfIteratorHelperLoose(_this.ignoreRules), _step; !(_step = _iterator()).done;) {
          var ignoreRule = _step.value;
          if (ignoreRule.test(it.message)) {
            return false;
          }
        }
        return true;
      });
      if (result.errors.length === 0) {
        return;
      }
      this.sessionId = result.sessionId;
      this.source.shouldReport() ? this.uploadSession() : this.show(true);
    },
    uploadSession: function uploadSession() {
      var _this2 = this;
      this.manager().then(function (manager) {
        return manager.session(_this2.sessionId).then(function (session) {
          return manager.uploadSessions([session]);
        }).then(function () {
          return _this2.show(false);
        });
      });
    },
    modalPreview: function modalPreview() {
      var _this3 = this;
      this.manager().then(function (manager) {
        return manager.session(_this3.sessionId);
      }).then(function (session) {
        _this3.elementConfig.class('message info full-center');
        var previewPlayer = _this3.getChild('previewPlayer');
        previewPlayer.sessionReplay(session);
      });
    }
  });
  return _default;
});
//# sourceMappingURL=dialog-catch-error.js.map