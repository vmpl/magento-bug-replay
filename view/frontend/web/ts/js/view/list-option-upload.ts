import ko from 'knockout';
import ListItemOption from "VMPL_BugReplay/js/view/list-item-option";

export default ListItemOption.extend({
    defaults: {
        template: 'VMPL_BugReplay/player/list/item/option-upload',
    },
    onClick(target: any, event: MouseEvent) {
        event.stopPropagation();
        this.item.upload(!this.item.upload());
    },
});
