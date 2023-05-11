/*eslint-disable */
/* jscs:disable */
define([], function () {
  var deserialize = new Map();
  function randomstring(length) {
    if (length === void 0) {
      length = 64;
    }
    var outString = '';
    var inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    return outString;
  }
  function serialize() {
    return function (target) {
      if (!target.hasOwnProperty('$serializeProperties')) {
        Object.defineProperty(target, '$serializeProperties', {
          value: [],
          configurable: false,
          writable: false,
          enumerable: true
        });
      }
      var $serializeProperties = target.$serializeProperties;
      var $deserializable = function (data) {
        var deserializable = new this();
        deserializable.$_serializeProperties.forEach(function (it) {
          deserializable[it] = data[it];
          if (deserializable[it].hasOwnProperty('$serializable')) {
            deserializable[it] = deserializable[it].$deserializable(deserializable[it]);
          }
        });
        return deserializable;
      }.bind(target);
      var deserializeToken;
      do {
        deserializeToken = randomstring();
      } while (deserialize.has(deserializeToken));
      deserialize.set(deserializeToken, $deserializable);
      if (!target.hasOwnProperty('$serializable')) {
        Object.defineProperty(target, '$serializable', {
          writable: false,
          enumerable: false,
          configurable: false,
          value: function value() {
            var self = this;
            var serializable = {};
            serializable['$serializableClass'] = deserializeToken;
            $serializeProperties.forEach(function (it) {
              serializable[it] = self[it];
              if (serializable[it].hasOwnProperty('$serializable')) {
                serializable[it] = serializable[it].$serializable();
              }
            });
            return serializable;
          }
        });
      }
    };
  }
  function serializable() {
    return function (target, propertyKey) {
      if (!target.hasOwnProperty('$serializeProperties')) {
        Object.defineProperty(target, '$serializeProperties', {
          value: [],
          configurable: false,
          writable: false,
          enumerable: true
        });
      }
      var serializableClass = target;
      serializableClass.$serializeProperties.push(propertyKey);
    };
  }
  return {
    serializable: serializable,
    serialize: serialize,
    deserialize: deserialize
  };
});
//# sourceMappingURL=decorator-serializer.js.map