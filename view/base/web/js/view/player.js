/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout"], function (_uiComponent, _knockout) {
  var _default = _uiComponent.extend({
    events: _knockout.observableArray([]),
    defaults: {
      template: 'VMPL_BugReplay/player/rrweb',
      imports: {
        manager: '${ $.provider }:manager'
      },
      listens: {
        '${ $.provider }:activeSession': 'sessionReplay'
      }
    },
    sessionReplay: function sessionReplay(session) {
      var _this = this;
      if (!session.id) {
        return Promise.resolve();
      }
      var thenManager = this.manager();
      return thenManager.then(function (manager) {
        return manager.getEventsForSessionAt([session]);
      }).then(function (events) {
        return _this.events(events);
      });
    },
    afterRender: function afterRender(element) {
      if (!this.element) {
        this.element = element;
        window.addEventListener('resize', this.bindPlayer.bind(this), {
          passive: true
        });
      }
      this.events.subscribe(this.bindPlayer.bind(this));
    },
    bindPlayer: function bindPlayer() {
      while (this.element.lastElementChild) {
        this.element.removeChild(this.element.lastElementChild);
      }
      var width = this.element.clientWidth;
      var height = width * 656 / 1024;
      var events = this.events();
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