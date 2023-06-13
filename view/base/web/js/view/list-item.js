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
      element.addEventListener('mousedown', this.onEventFireGesture.bind(this, 'mousedown'), {
        passive: true
      });
      element.addEventListener('mousemove', this.onEventFireGesture.bind(this, 'mousemove'), {
        passive: true
      });
      element.addEventListener('mouseup', this.onEventFireGesture.bind(this, 'mouseup'), {
        passive: true
      });
      element.addEventListener('touchstart', this.onEventFireGesture.bind(this, 'touchstart'), {
        passive: true
      });
      element.addEventListener('touchmove', this.onEventFireGesture.bind(this, 'touchmove'), {
        passive: true
      });
      element.addEventListener('touchend', this.onEventFireGesture.bind(this, 'touchend'), {
        passive: true
      });
      element.addEventListener('tap', this.onTap.bind(this), {
        passive: true
      });
    },
    onEventFireGesture: function onEventFireGesture(type, event) {
      switch (type) {
        case 'mousedown':
        case 'touchstart':
          this.tapEvent = event;
          break;
        case 'mousemove':
        case 'touchmove':
          delete this.tapEvent;
          break;
        case 'mouseup':
        case 'touchend':
          !this.tapEvent || this.element.dispatchEvent(new MouseEvent('tap', event));
          break;
      }
    },
    onTap: function onTap(event) {
      this.itemActive(this.item);
    }
  });
  return _default;
});
//# sourceMappingURL=list-item.js.map