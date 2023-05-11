/*eslint-disable */
/* jscs:disable */
define([], function () {
  var serializer = {
    serialize: function serialize(input, defaultSerialize) {
      return defaultSerialize(input);
    },
    deserialize: function deserialize(message, defaultDeserialize) {
      if (message.hasOwnProperty('$$classModule')) {
        console.log(message['$$classModule']);
        var _message$$$classModul = message['$$classModule'].split(';'),
          ScriptUrl = _message$$$classModul[0],
          ModuleClass = _message$$$classModul[1],
          DeserializeClass = _message$$$classModul[2];
        var moduleDefinition = require.async([ModuleClass]);
        console.log(moduleDefinition);
      }
      return defaultDeserialize(message);
    }
  };
  var _default = serializer;
  return _default;
});
//# sourceMappingURL=worker-serializer.js.map