import Component from 'uiComponent';
import ko from 'knockout';
import ItemSession from "VMPL_BugReplay/js/model/item-session";

export default Component.extend({
    activeSession: ko.observable<ItemSession>(),
    defaults: {
        template: 'VMPL_BugReplay/player/list/item',
        links: {
            activeSession: '${ $.provider }:activeSession',
            item: '${ $.provider }:sessions.${ $.itemIndex }',
        },
    },
    initObservable() {
        this._super();
        this.isActive = ko.pureComputed<boolean>(() => {
            return this.activeSession().id === this.item.id;
        }, this);
        return this;
    },
    afterRender(element: HTMLElement) {
        // @todo hammer manager
    }
});
