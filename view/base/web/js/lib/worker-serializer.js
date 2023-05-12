/*eslint-disable */
/* jscs:disable */
define([], function () {
  function serializable() {
    return function () {
      console.log(arguments);
    };
  }
  var WorkerSerializer = /*#__PURE__*/function () {
    "use strict";

    function WorkerSerializer() {}
    WorkerSerializer.default = function _default() {
      return new WorkerSerializer();
    };
    var _proto = WorkerSerializer.prototype;
    _proto.serialize = function serialize(input, defaultSerialize) {};
    _proto.deserialize = function deserialize(message, defaultDeserialize) {};
    return WorkerSerializer;
  }();
  return Object.assign(WorkerSerializer, {
    serializable: serializable
  });
});
//# sourceMappingURL=worker-serializer.js.map