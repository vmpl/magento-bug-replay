/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "VMPL_BugReplay/js/model/data"], function (_uiComponent, _data) {
  var _default = _uiComponent.extend({
    afterRender: function afterRender(element) {
      var _this = this;
      if (!this.element) {
        this.element = element;
      }
      _data.events.subscribe(function () {
        while (_this.element.lastElementChild) {
          _this.element.removeChild(_this.element.lastElementChild);
        }
        var events = _data.events();
        console.log(events);
        _this.player = new rrwebPlayer({
          target: _this.element,
          props: {
            events: events
          }
        });
      });
    }
  });
  return _default;
});
//# sourceMappingURL=player.js.map