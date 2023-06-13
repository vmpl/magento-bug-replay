import Component from "uiComponent";
import ko from 'knockout';
import ItemSession from "VMPL_BugReplay/js/model/item-session";
import $t from 'mage/translate';
import Data from "VMPL_BugReplay/js/model/data";

export default Component.extend({
    visibility: ko.observable<boolean>(false),
    sessions: ko.observableArray<ItemSession>(),
    defaults: {
        template: 'VMPL_BugReplay/player/mass-action',
        submitLabel: $t('Upload'),
        modules: {
            list: 'player.sidebar.list',
        },
        imports: {
            sessions: '${ $.provider }:sessions',
        },
    },
    initObservable() {
        this._super();

        this.sessions.subscribe((sessions: { [index: number]: ItemSession }) => {
            Object.values(sessions)
                .forEach(session => {
                    session.upload.subscribe(this.onSessionUploadChange.bind(this));
                })
        })

        return this;
    },
    onSessionUploadChange() {
        const sessions: { [index: number]: ItemSession } = this.sessions();
        const uploadChecked = Object.values(sessions).some(it => it.upload());
        this.visibility(uploadChecked);
    },
    onSubmit(target: any, event: MouseEvent) {
        event.stopPropagation();

        const sessions = Object.values<ItemSession>(this.sessions()).filter((it: ItemSession) => it.upload());
        Data.manager
            .then(manager => manager.uploadSessions(sessions))
            .then(() => {
                this.onCancel();
                return this.list().reload()
            })
            .then(() => alert($t('Uploaded')));
    },
    onCancel() {
        Object.values(this.sessions())
            .forEach((session: ItemSession) => session.upload(false));
    }
});
