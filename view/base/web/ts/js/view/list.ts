// @ts-ignore
import layout from 'uiLayout';
import registry from "uiRegistry";
import Component from 'uiComponent';
import ko from 'knockout';
import ItemSession, {ItemSessionFactory} from "VMPL_BugReplay/js/model/item-session";
import {Exception as ItemPaginatorException} from "VMPL_BugReplay/js/bug-replay/items-paginator";
import RecorderManager from "VMPL_BugReplay/js/bug-replay/recorder-manager";

export default Component.extend({
    listOpen: ko.observable(false),
    sessions: ko.observableArray<ItemSession>([]),
    itemComponents: ko.observableArray([]),
    defaults: {
        template: 'VMPL_BugReplay/player/list',
        imports: {
            manager: '${ $.provider }:manager'
        },
        exports: {
            sessions: '${ $.provider }:sessions',
        },
        itemConfig: {
            component: 'VMPL_BugReplay/js/view/list-item',
            config: {
                provider: '${ $.provider }',
            },
            children: {
                options: {
                    component: 'uiComponent',
                    displayArea: 'options',
                    children: {}
                }
            }
        },
    },
    initObservable() {
        this._super();
        this.loadFirst();
        return this;
    },
    loadFirst() {
        const listSubscribe = this.itemComponents.subscribe(() => {
            const component = this.itemComponents.slice(0, 1).shift();
            component.itemActive(component.item);

            listSubscribe.dispose()
        });
    },
    reload() {
        this.itemComponents().forEach((it: any) => it.destroy());
        this.sessions.removeAll();
        this.itemComponents.removeAll();
        this.loadFirst();

        const thenManager: Promise<RecorderManager> = this.manager()
        return thenManager
            .then(manager => manager.paginator.clear())
            .then(() => (this.elementLoading.hidden = false));
    },
    dynamicLoad(): Promise<void> {
        const thenManager: Promise<RecorderManager> = this.manager()
        return thenManager
            .then(manager => manager.paginator.getPage()
                .then(sessions => {
                    const itemSessions = sessions.map(it => ItemSessionFactory.create(it));
                    this.sessions.push(...itemSessions);

                return Promise.all(itemSessions.map(this.mapItemComponent.bind(this)))
            })
            .then(items => {
                manager.paginator.page++
                this.itemComponents.push(...items);
            })
            .then(() => {
                !this.isInViewport()
                || this.dynamicLoad();
            })
            .catch(error => {
                if (error instanceof ItemPaginatorException) {
                    this.elementLoading.hidden = true;
                    return;
                }

                throw error;
            }));
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
    mapItemComponent(itemSession: ItemSession) {
        const componentConfig = structuredClone(this.itemConfig);
        componentConfig.name = `${this.name}.item_${itemSession.id}`;
        componentConfig.itemIndex = this.sessions.indexOf(itemSession);

        layout([componentConfig]);
        return registry.promise(componentConfig.name)
    }
});
