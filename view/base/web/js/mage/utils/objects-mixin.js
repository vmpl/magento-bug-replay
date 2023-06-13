/*eslint-disable */
/* jscs:disable */
define([], function () {
  function _default(objects) {
    var originalCopy = objects.copy.bind(objects);
    objects.copy = function (data) {
      switch (true) {
        case (data == null ? void 0 : data.constructor.name) === '_class':
          return data;
        default:
          return originalCopy(data);
      }
    };
    return objects;
  }
  return _default;
});
//# sourceMappingURL=objects-mixin.js.map