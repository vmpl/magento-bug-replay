/*eslint-disable */
/* jscs:disable */
define([], function () {
  var Converter = /*#__PURE__*/function () {
    "use strict";

    function Converter() {}
    Converter.objectToClass = function objectToClass(data) {
      var _this = this;
      switch (true) {
        case data instanceof Array:
          return Promise.all(data.map(this.objectToClass.bind(this)));
        case data instanceof Object:
          return Promise.all(Object.values(data).map(function (it) {
            return _this.objectToClass(it);
          })).then(function (values) {
            var convertedObject = Object.keys(data).map(function (key, index) {
              return [key, values[index]];
            });
            convertedObject = Object.fromEntries(convertedObject);
            if (data.hasOwnProperty('$$classModule')) {
              var _data$$$classModule$s = data['$$classModule'].split(';'),
                ModuleClass = _data$$$classModule$s[0],
                LoadedClass = _data$$$classModule$s[1];
              return new Promise(function (resolve) {
                require([ModuleClass], function (modules) {
                  var module = new modules[LoadedClass]();
                  resolve(Object.assign(module, convertedObject));
                });
              });
            }
            return convertedObject;
          });
        default:
          return Promise.resolve(data);
      }
    };
    return Converter;
  }();
  return Converter;
});
//# sourceMappingURL=converter.js.map