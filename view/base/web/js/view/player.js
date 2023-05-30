/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "VMPL_BugReplay/js/model/data"], function (_uiComponent, _data) {
  var _default = _uiComponent.extend({
    afterRender: function afterRender(element) {
      if (!this.element) {
        this.element = element;
        window.addEventListener('resize', this.bindPlayer.bind(this), {
          passive: true
        });
      }
      _data.events.subscribe(this.bindPlayer.bind(this));
    },
    bindPlayer: function bindPlayer() {
      while (this.element.lastElementChild) {
        this.element.removeChild(this.element.lastElementChild);
      }
      var width = this.element.clientWidth;
      var height = width * 656 / 1024;
      var events = _data.events();
      this.player = new rrwebPlayer({
        target: this.element,
        props: {
          events: events,
          width: width,
          height: height
        }
      });
    }
  });
  return _default;
});
//# sourceMappingURL=player.js.map