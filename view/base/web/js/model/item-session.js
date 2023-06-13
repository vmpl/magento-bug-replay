/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["VMPL_BugReplay/js/lib/session/model/record-session", "VMPL_BugReplay/js/lib/decorator/primary", "knockout"], function (_recordSession, _primary, _knockout) {
  var _dec, _class;
  var Factory = /*#__PURE__*/function () {
    "use strict";

    function Factory() {}
    var _proto = Factory.prototype;
    _proto.create = function create(session) {
      return new ItemSession(session.title, session.href, session.timestamp, session.id, session.uploaded, session.events);
    };
    return Factory;
  }();
  var ItemSessionFactory = new Factory();
  var ItemSession = (_dec = (0, _primary)('id'), _dec(_class = /*#__PURE__*/function (_recordSession$Record) {
    "use strict";

    _inheritsLoose(ItemSession, _recordSession$Record);
    function ItemSession() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _recordSession$Record.call.apply(_recordSession$Record, [this].concat(args)) || this;
      _this.optionsVisible = _knockout.observable(false);
      _this.upload = _knockout.observable(false);
      return _this;
    }
    return ItemSession;
  }(_recordSession.RecordSession)) || _class);
  return Object.assign(ItemSession, {
    ItemSessionFactory: ItemSessionFactory
  });
});
//# sourceMappingURL=item-session.js.map