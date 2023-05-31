import Component from 'uiComponent';
import registry from "uiRegistry";
import ko from 'knockout';

export default Component.extend({
    defaults: {
        template: 'VMPL_BugReplay/player/list/item/option-upload',
    },
    checked: ko.observable<boolean>(false),
    onClick() {
        let parentName = this.parentName.split('.')
        parentName.pop()
        return Promise.all([
            registry.promise(parentName.join('.')),
            registry.promise(this.provider)
        ])
            .then(([listComponent, selectProvider]) => {
                this.checked(!this.checked())
                selectProvider.selectItem(listComponent.item, this.checked());
            })
    }
});
