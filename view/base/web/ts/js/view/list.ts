// @ts-ignore
import layout from 'uiLayout';
import registry from "uiRegistry";
import Component from 'uiComponent';
import ko from 'knockout';
import Data from 'VMPL_BugReplay/js/model/data';
import sessionReplay from "VMPL_BugReplay/js/action/session-replay";
import {RecordSession} from "VMPL_BugReplay/js/lib/session/model/record-session";

class ItemSession extends RecordSession {
    public readonly optionsVisible: KnockoutObservable<boolean> = ko.observable(false);

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
    defaults: {
        template: 'VMPL_BugReplay/player/list',
        itemConfig: {
            component: 'VMPL_BugReplay/js/view/list-item',
            config: {},
            children: {
                options: {
                    component: 'uiComponent',
                    displayArea: 'options',
                    children: {
                        delete: {
                            component: 'VMPL_BugReplay/js/view/list-option-delete',
                            config: {},
                        }
                    }
                }
            }
        },
    },
    listOpen: ko.observable(false),
    itemComponents: ko.observableArray([]),
    idActive: ko.observable(0),
    initialize(options: object) {
        this._super(options);
        const listSubscribe = this.itemComponents.subscribe(() => {
            this.setActiveItem(this.itemComponents.slice(0, 1).shift());
            listSubscribe.dispose()
        })
        return this;
    },
    setActiveItem(component: any) {
        const session = component.item;

        this.idActive(session.id);
        this.listOpen(false);
        sessionReplay(session);
        return this;
    },
    toggleOptionsActive(component?: any) {
        const session = component ? component : this.itemComponents()
            .find((it: any) => it.item.id === this.idActive())
        session?.item.optionsVisible(!session?.item.optionsVisible());
    },
    dynamicLoad(): Promise<void> {
        return Data.manager
            .then(manager => manager.paginator.getPage()
                .then(sessions => {
                    return Promise.all(
                        sessions.map(it => ItemSession.from(it))
                            .map(this.mapItemComponent.bind(this))
                    )
                })
                .then(items => {
                    manager.paginator.page++
                    this.itemComponents.push(...items)
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
    onItemClick(component: any, event: MouseEvent) {
        const isMobile = getComputedStyle(this.conteinerElement).flexDirection === 'column';
        switch (true) {
            case isMobile && !this.listOpen():
                this.listOpen(true);
                break;
            case isMobile && this.listOpen():
            case !isMobile && event.detail > 1:
                this.setActiveItem(component);
                break;
            case !isMobile && event.detail === 1:
                this.toggleOptionsActive(component);
                break;
        }
    },
    mapItemComponent(it: RecordSession) {
        const componentConfig = structuredClone(this.itemConfig);
        componentConfig.name = `${this.name}.${it.id}.item`;
        componentConfig.config.item = it;
        componentConfig.config.provider = this.name;
        componentConfig.idActive = this.idActive;
        componentConfig.onItemClick = this.onItemClick.bind(this);
        componentConfig.setActiveItem = this.setActiveItem.bind(this);

        layout([componentConfig]);
        return registry.promise(componentConfig.name);
    }
});
