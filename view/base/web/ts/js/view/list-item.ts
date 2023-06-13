import Component from 'uiComponent';
import ko from 'knockout';
import ItemSession from "VMPL_BugReplay/js/model/item-session";

export default Component.extend({
    itemActive: ko.observable<ItemSession>(),
    defaults: {
        template: 'VMPL_BugReplay/player/list/item',
        links: {
            item: '${ $.provider }:sessions.${ $.itemIndex }',
            itemActive: '${ $.provider }:activeSession',
        },
    },
    afterRender(element: HTMLElement) {
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
    onEventFireGesture(type: string, event: MouseEvent | TouchEvent) {
        const target = <HTMLElement>event.target;
        if (target.closest('.actions')) {
            return;
        }

        switch (type) {
            case 'mousedown':
            case 'touchstart':
                this.tapEvent = event;
                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(() => {
                    delete this.tapEvent;
                    this.element.dispatchEvent(new MouseEvent('hold', event));
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
                !this.tapEvent
                    || this.element.dispatchEvent(new MouseEvent('tap', event));
                break;
        }
    },
    onTap(event: MouseEvent | TouchEvent) {
        if (this.item.optionsVisible()) {
            return this.item.optionsVisible(false);
        }

        this.itemActive(this.item);
    },
    onHold(event: MouseEvent | TouchEvent) {
        this.item.optionsVisible(true);
    },
});
