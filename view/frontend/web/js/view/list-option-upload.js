/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/view/list-item-option"], function (_listItemOption) {
  var _default = _listItemOption.extend({
    defaults: {
      template: 'VMPL_BugReplay/player/list/item/option-upload'
    },
    onClick: function onClick(target, event) {
      event.stopPropagation();
      this.item.upload(!this.item.upload());
    }
  });
  return _default;
});
//# sourceMappingURL=list-option-upload.js.map