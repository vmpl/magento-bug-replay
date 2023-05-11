/*eslint-disable */
/* jscs:disable */
define([], function () {
  var serializer = {
    serialize: function serialize(input, defaultSerialize) {
      if (input != null && input.hasOwnProperty('$serializable')) {
        return defaultSerialize(input.$serializable());
      }
      return defaultSerialize(input);
    },
    deserialize: function deserialize(message, defaultDeserialize) {
      return defaultDeserialize(message);
    }
  };
  var _default = serializer;
  return _default;
});
//# sourceMappingURL=worker-serializer.js.map