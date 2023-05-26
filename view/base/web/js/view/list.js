/*eslint-disable */
/* jscs:disable */
define(["uiComponent", "knockout", "VMPL_BugReplay/js/model/data", "VMPL_BugReplay/js/action/session-replay"], function (_uiComponent, _knockout, _data, _sessionReplay) {
  var _default = _uiComponent.extend({
    listOpen: _knockout.observable(false),
    itemList: _knockout.observableArray([]),
    itemActive: _knockout.observable(0),
    initialize: function initialize(options) {
      var _this = this;
      this._super(options);
      var listSubscribe = this.itemList.subscribe(function () {
        _this.setActiveItem(_this.itemList.slice(0, 1).shift());
        listSubscribe.dispose();
      });
      return this;
    },
    setActiveItem: function setActiveItem(session) {
      this.itemActive(session.id);
      this.listOpen(false);
      (0, _sessionReplay)(session);
      return this;
    },
    toggleListOpen: function toggleListOpen() {
      this.listOpen(!this.listOpen());
    },
    dynamicLoad: function dynamicLoad() {
      var _this2 = this;
      return _data.manager.then(function (manager) {
        return manager.paginator.getPage().then(function (items) {
          var _this2$itemList;
          manager.paginator.page++;
          (_this2$itemList = _this2.itemList).push.apply(_this2$itemList, items);
        }).then(function () {
          !_this2.isInViewport() || _this2.dynamicLoad();
        }).catch(function (error) {
          _this2.elementLoadingObserver.disconnect();
          _this2.elementLoading.hidden = true;
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
    },
    isInViewport: function isInViewport() {
      var rect = this.elementLoading.getBoundingClientRect();
      return !this.elementLoading.hidden && rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }
  });
  return _default;
});
//# sourceMappingURL=list.js.map