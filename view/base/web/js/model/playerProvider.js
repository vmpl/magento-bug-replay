/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout"], function (_uiComponent, _knockout) {
  var _default = _uiComponent.extend({
    defaults: {
      ignoreTmpls: {
        data: true
      }
    },
    sessions: _knockout.observableArray([]),
    activeSessionId: _knockout.observable(0)
  });
  return _default;
});
//# sourceMappingURL=playerProvider.js.map