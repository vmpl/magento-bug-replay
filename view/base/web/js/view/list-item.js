/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout"], function (_uiComponent, _knockout) {
  var _default = _uiComponent.extend({
    itemActive: _knockout.observable(),
    defaults: {
      template: 'VMPL_BugReplay/player/list/item',
      links: {
        item: '${ $.provider }:sessions.${ $.itemIndex }',
        itemActive: '${ $.provider }:activeSession'
      }
    },
    afterRender: function afterRender(element) {
      this.element = element;
      element.addEventListener('mousedown', this.onEventFireGesture.bind(this, 'mousedown'));
      element.addEventListener('mousemove', this.onEventFireGesture.bind(this, 'mousemove'));
      element.addEventListener('mouseup', this.onEventFireGesture.bind(this, 'mouseup'));
      element.addEventListener('touchstart', this.onEventFireGesture.bind(this, 'touchstart'));
      element.addEventListener('touchmove', this.onEventFireGesture.bind(this, 'touchmove'));
      element.addEventListener('touchend', this.onEventFireGesture.bind(this, 'touchend'));
      element.addEventListener('tap', this.onTap.bind(this));
      element.addEventListener('hold', this.onHold.bind(this));
    },
    onEventFireGesture: function onEventFireGesture(type, event) {
      var _this = this;
      var target = event.target;
      if (target.closest('.actions')) {
        return;
      }
      switch (type) {
        case 'mousedown':
        case 'touchstart':
          this.tapEvent = event;
          clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout(function () {
            delete _this.tapEvent;
            _this.element.dispatchEvent(new MouseEvent('hold', event));
          }, 1000);
          break;
        case 'mousemove':
        case 'touchmove':
          delete this.tapEvent;
          clearTimeout(this.timeoutId);
          break;
        case 'mouseup':
        case 'touchend':
          clearTimeout(this.timeoutId);
          !this.tapEvent || this.element.dispatchEvent(new MouseEvent('tap', event));
          break;
      }
    },
    onTap: function onTap(event) {
      if (this.item.optionsVisible()) {
        return this.item.optionsVisible(false);
      }
      this.itemActive(this.item);
    },
    onHold: function onHold(event) {
      this.item.optionsVisible(true);
    }
  });
  return _default;
});
//# sourceMappingURL=list-item.js.map