import Component from 'uiComponent';
import ko from 'knockout';
import Data from 'VMPL_BugReplay/js/model/data'
import {IRecordSession} from "VMPL_BugReplay/js/api/session";
import sessionReplay from "VMPL_BugReplay/js/action/session-replay";

export default Component.extend({
    listOpen: ko.observable(false),
    itemList: ko.observableArray([]),
    itemActive: ko.observable(0),
    initialize(options: object) {
        this._super(options);
        const listSubscribe = this.itemList.subscribe(() => {
            this.setActiveItem(this.itemList.slice(0, 1).shift());
            listSubscribe.dispose()
        })
        return this;
    },
    setActiveItem(session: IRecordSession) {
        this.itemActive(session.id);
        this.listOpen(false);
        sessionReplay(session);
        return this;
    },
    toggleListOpen() {
        this.listOpen(!this.listOpen());
    },
    dynamicLoad(): Promise<void> {
        return Data.manager
            .then(manager => manager.paginator.getPage()
                .then((items: IRecordSession[]) => {
                    manager.paginator.page++
                    this.itemList.push(...items)
                })
                .then(() => {
                    !this.isInViewport()
                        || this.dynamicLoad();
                })
                .catch((error) => {
                    this.elementLoadingObserver.disconnect();
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
    }
});
