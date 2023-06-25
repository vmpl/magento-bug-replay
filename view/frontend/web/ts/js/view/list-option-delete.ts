import ListItemOption from "VMPL_BugReplay/js/view/list-item-option";
import RecorderManager from "VMPL_BugReplay/js/bug-replay/recorder-manager";

export default ListItemOption.extend({
    defaults: {
        text: '🗑',
        imports: {
            manager: '${ $.provider }:manager',
        },
    },
    onClick() {
        const thenManager: Promise<RecorderManager> = this.manager();
        return thenManager
            .then(manager => manager.delete([this.item]))
            .then(() => this.source.reload())
    }
});
