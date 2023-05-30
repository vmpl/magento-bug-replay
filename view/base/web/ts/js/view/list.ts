import Component from 'uiComponent';
import ko from 'knockout';
import Data from 'VMPL_BugReplay/js/model/data';
import {IRecordSession} from "VMPL_BugReplay/js/api/session";
import sessionReplay from "VMPL_BugReplay/js/action/session-replay";
import {RecordSession} from "VMPL_BugReplay/js/lib/session/model/record-session";

class ItemSession extends RecordSession {
    public readonly options: KnockoutObservable<boolean> = ko.observable(false);

    static from(child: RecordSession): ItemSession {
        return new this(
            child.title,
            child.href,
            child.timestamp,
            child.id,
            child.uploaded,
            child.events
        );
    }
}

export default Component.extend({
    listOpen: ko.observable(false),
    itemList: ko.observableArray([]),
    idActive: ko.observable(0),
    initialize(options: object) {
        this._super(options);
        const listSubscribe = this.itemList.subscribe(() => {
            this.setActiveItem(this.itemList.slice(0, 1).shift());
            listSubscribe.dispose()
        })
        return this;
    },
    setActiveItem(session: ItemSession) {
        this.idActive(session.id);
        this.listOpen(false);
        sessionReplay(session);
        return this;
    },
    toggleOptionsActive(chosen?: ItemSession) {
        const session = chosen ? chosen : this.itemList()
            .find((it: ItemSession) => it.id === this.idActive())
        session?.options(!session?.options());
    },
    dynamicLoad(): Promise<void> {
        return Data.manager
            .then(manager => manager.paginator.getPage()
                .then(sessions => {
                    manager.paginator.page++
                    const items = sessions.map(it => ItemSession.from(it));
                    this.itemList.push(...items)
                })
                .then(() => {
                    !this.isInViewport()
                        || this.dynamicLoad();
                })
                .catch((error) => {
                    this.elementLoading.hidden = true;
                }))

    },
    afterLoading(element: HTMLUListElement) {
        if (!this.elementLoading) {
            this.elementLoading = element;
            this.elementLoadingObserver = new IntersectionObserver(
                this.dynamicLoad.bind(this),
                {root: this.elementLoading.parentElement, threshold: 0.5}
            )
            this.elementLoadingObserver.observe(this.elementLoading);
        }

        if (!this.element) {
            this.element = element;
            this.listElement = element.closest('.vmpl_session .list');
            this.conteinerElement = element.closest('.vmpl_session');
        }
    },
    isInViewport() {
        const rect = this.elementLoading.getBoundingClientRect();
        return (
            !this.elementLoading.hidden
            && rect.top >= 0
            && rect.left >= 0
            && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
    },
    onItemClick(item: RecordSession, event: MouseEvent) {
        const isMobile = getComputedStyle(this.conteinerElement).flexDirection === 'column';
        switch (true) {
            case isMobile && !this.listOpen():
                this.listOpen(true);
                break;
            case isMobile && this.listOpen():
            case !isMobile && event.detail > 1:
                this.setActiveItem(item);
                break;
            case !isMobile && event.detail === 1:
                this.toggleOptionsActive(item);
                break;
        }
    },
    formatDate(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toLocaleString();
    },
    deleteItem(item: RecordSession) {
        return Data.manager
            .then(manager => manager.delete([item]))
            .then(() => this.itemList.removeAll())
            .then(() => {
                this.elementLoading.hidden = false;
            })
    }
});
