import ListItemOption from "VMPL_BugReplay/js/view/list-item-option";
import Data from 'VMPL_BugReplay/js/model/data';

export default ListItemOption.extend({
    defaults: {
        text: '🗑',
    },
    onClick() {
        return Data.manager
            .then(manager => manager.delete([this.item]))
            .then(() => this.source.reload())
    }
});
