/*eslint-disable */
/* jscs:disable */
define([], function () {
  function serializable() {
    return function (target, propertyKey, descriptor) {
      var _target$__serializabl;
      target.__serializable = (_target$__serializabl = target.__serializable) != null ? _target$__serializabl : [];
      target.__serializable.push(propertyKey);
    };
  }
  var serializer = {
    serialize: function serialize(input, defaultSerialize) {
      if (!input.hasOwnProperty('__serializable')) {
        return defaultSerialize(input);
      }
    },
    deserialize: function deserialize(message, defaultDeserialize) {
      return defaultDeserialize(message);
    }
  };
  var _default = serializer;
  return Object.assign(_default, {
    serializable: serializable
  });
});
//# sourceMappingURL=worker-serializer.js.map