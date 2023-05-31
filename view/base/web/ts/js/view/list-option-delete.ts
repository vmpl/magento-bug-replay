import Component from 'uiComponent';
import registry from "uiRegistry";
import Data from 'VMPL_BugReplay/js/model/data';

export default Component.extend({
    defaults: {
        template: 'VMPL_BugReplay/player/list/item/option',
        text: '🗑',
    },
    onClick() {
        let parentName = this.parentName.split('.')
        parentName.pop()
        return registry.promise(parentName.join('.'))
            .then(component => Data.manager
                .then(manager => manager.delete([component.item])))
    }
});
