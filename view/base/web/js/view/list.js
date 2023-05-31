/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["uiLayout", "uiRegistry", "uiComponent", "knockout", "VMPL_BugReplay/js/model/data", "VMPL_BugReplay/js/action/session-replay", "VMPL_BugReplay/js/lib/session/model/record-session"], function (_uiLayout, _uiRegistry, _uiComponent, _knockout, _data, _sessionReplay, _recordSession) {
  // @ts-ignore
  var ItemSession = /*#__PURE__*/function (_recordSession$Record) {
    "use strict";

    _inheritsLoose(ItemSession, _recordSession$Record);
    function ItemSession() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _recordSession$Record.call.apply(_recordSession$Record, [this].concat(args)) || this;
      _this.optionsVisible = _knockout.observable(false);
      return _this;
    }
    ItemSession.from = function from(child) {
      return new this(child.title, child.href, child.timestamp, child.id, child.uploaded, child.events);
    };
    return ItemSession;
  }(_recordSession.RecordSession);
  var _default = _uiComponent.extend({
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
                config: {}
              }
            }
          }
        }
      }
    },
    listOpen: _knockout.observable(false),
    itemComponents: _knockout.observableArray([]),
    idActive: _knockout.observable(0),
    initialize: function initialize(options) {
      var _this2 = this;
      this._super(options);
      var listSubscribe = this.itemComponents.subscribe(function () {
        _this2.setActiveItem(_this2.itemComponents.slice(0, 1).shift());
        listSubscribe.dispose();
      });
      return this;
    },
    setActiveItem: function setActiveItem(component) {
      var session = component.item;
      this.idActive(session.id);
      this.listOpen(false);
      (0, _sessionReplay)(session);
      return this;
    },
    toggleOptionsActive: function toggleOptionsActive(component) {
      var _this3 = this;
      var session = component ? component : this.itemComponents().find(function (it) {
        return it.item.id === _this3.idActive();
      });
      session == null ? void 0 : session.item.optionsVisible(!(session != null && session.item.optionsVisible()));
    },
    dynamicLoad: function dynamicLoad() {
      var _this4 = this;
      return _data.manager.then(function (manager) {
        return manager.paginator.getPage().then(function (sessions) {
          return Promise.all(sessions.map(function (it) {
            return ItemSession.from(it);
          }).map(_this4.mapItemComponent.bind(_this4)));
        }).then(function (items) {
          var _this4$itemComponents;
          manager.paginator.page++;
          (_this4$itemComponents = _this4.itemComponents).push.apply(_this4$itemComponents, items);
        }).then(function () {
          !_this4.isInViewport() || _this4.dynamicLoad();
        }).catch(function (error) {
          _this4.elementLoading.hidden = true;
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
    mapItemComponent: function mapItemComponent(it) {
      var componentConfig = structuredClone(this.itemConfig);
      componentConfig.name = this.name + "." + it.id + ".item";
      componentConfig.config.item = it;
      componentConfig.config.provider = this.name;
      componentConfig.idActive = this.idActive;
      componentConfig.onItemClick = this.onItemClick.bind(this);
      componentConfig.setActiveItem = this.setActiveItem.bind(this);
      (0, _uiLayout)([componentConfig]);
      return _uiRegistry.promise(componentConfig.name);
    }
  });
  return _default;
});
//# sourceMappingURL=list.js.map