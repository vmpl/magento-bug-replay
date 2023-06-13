/*eslint-disable */
/* jscs:disable */
define(["uiLayout", "uiRegistry", "uiComponent", "knockout", "VMPL_BugReplay/js/model/data", "VMPL_BugReplay/js/model/item-session", "VMPL_BugReplay/js/lib/items-paginator"], function (_uiLayout, _uiRegistry, _uiComponent, _knockout, _data, _itemSession, _itemsPaginator) {
  // @ts-ignore
  var _default = _uiComponent.extend({
    listOpen: _knockout.observable(false),
    sessions: _knockout.observableArray([]),
    itemComponents: _knockout.observableArray([]),
    defaults: {
      template: 'VMPL_BugReplay/player/list',
      exports: {
        sessions: '${ $.provider }:sessions'
      },
      itemConfig: {
        component: 'VMPL_BugReplay/js/view/list-item',
        config: {
          provider: '${ $.provider }'
        },
        children: {
          options: {
            component: 'uiComponent',
            displayArea: 'options',
            children: {
              delete: {
                component: 'VMPL_BugReplay/js/view/list-option-delete',
                config: {}
              }
            }
          }
        }
      }
    },
    initObservable: function initObservable() {
      var _this = this;
      this._super();
      var listSubscribe = this.itemComponents.subscribe(function () {
        var component = _this.itemComponents.slice(0, 1).shift();
        component.itemActive(component.item);
        listSubscribe.dispose();
      });
      return this;
    },
    toggleOptionsActive: function toggleOptionsActive(component) {
      var _this2 = this;
      var session = component ? component : this.itemComponents().find(function (it) {
        return it.item.id === _this2.idActive();
      });
      session == null ? void 0 : session.item.optionsVisible(!(session != null && session.item.optionsVisible()));
    },
    dynamicLoad: function dynamicLoad() {
      var _this3 = this;
      return _data.manager.then(function (manager) {
        return manager.paginator.getPage().then(function (sessions) {
          var _this3$sessions;
          var itemSessions = sessions.map(function (it) {
            return _itemSession.ItemSessionFactory.create(it);
          });
          (_this3$sessions = _this3.sessions).push.apply(_this3$sessions, itemSessions);
          return Promise.all(itemSessions.map(_this3.mapItemComponent.bind(_this3)));
        }).then(function (items) {
          var _this3$itemComponents;
          manager.paginator.page++;
          (_this3$itemComponents = _this3.itemComponents).push.apply(_this3$itemComponents, items);
        }).then(function () {
          !_this3.isInViewport() || _this3.dynamicLoad();
        }).catch(function (error) {
          if (error instanceof _itemsPaginator.Exception) {
            _this3.elementLoading.hidden = true;
            return;
          }
          throw error;
        });
      });
    },
    afterLoading: function afterLoading(element) {
      if (!this.elementLoading) {
        this.elementLoading = element;
        this.elementLoadingObserver = new IntersectionObserver(this.dynamicLoad.bind(this), {
          root: this.elementLoading.parentElement,
          threshold: 0.5
        });
        this.elementLoadingObserver.observe(this.elementLoading);
      }
      if (!this.element) {
        this.element = element;
        this.listElement = element.closest('.vmpl_session .list');
        this.conteinerElement = element.closest('.vmpl_session');
      }
    },
    isInViewport: function isInViewport() {
      var rect = this.elementLoading.getBoundingClientRect();
      return !this.elementLoading.hidden && rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    },
    onItemClick: function onItemClick(component, event) {
      var isMobile = getComputedStyle(this.conteinerElement).flexDirection === 'column';
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
    mapItemComponent: function mapItemComponent(itemSession) {
      var componentConfig = structuredClone(this.itemConfig);
      componentConfig.name = this.name + ".item_" + itemSession.id;
      componentConfig.itemIndex = this.sessions.indexOf(itemSession);
      (0, _uiLayout)([componentConfig]);
      return _uiRegistry.promise(componentConfig.name);
    }
  });
  return _default;
});
//# sourceMappingURL=list.js.map