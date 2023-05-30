/*eslint-disable */
/* jscs:disable */
define(["knockout"], function (_knockout) {
  var Converter = /*#__PURE__*/function () {
    "use strict";

    function Converter() {}
    Converter.classToObject = function classToObject(data) {
      if (_knockout.isObservable(data)) {
        return Promise.resolve(data());
      }
      switch (true) {
        case data instanceof Blob:
          return Promise.resolve(data);
        case data instanceof Array:
          return Promise.all(data.map(this.classToObject.bind(this)));
        case data instanceof Object:
          if (data['$$serialize'] instanceof Function) {
            return Promise.resolve(data['$$serialize']());
          }
          return Promise.all(Object.values(data).map(this.classToObject.bind(this))).then(function (values) {
            var convertedObject = Object.keys(data).map(function (key, index) {
              return [key, values[index]];
            });
            return Object.fromEntries(convertedObject);
          });
        default:
          return Promise.resolve(data);
      }
    };
    Converter.objectToClass = function objectToClass(data) {
      var _this = this;
      switch (true) {
        case data instanceof Blob:
          return Promise.resolve(data);
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
                RequiredClass = _data$$$classModule$s[1];
              return new Promise(function (resolve) {
                require([ModuleClass], function (modules) {
                  var loadedClass = modules[RequiredClass];
                  if (loadedClass['$$deserialize'] instanceof Function) {
                    resolve(loadedClass['$$deserialize'](convertedObject));
                  } else {
                    resolve(Object.assign(new loadedClass(), convertedObject));
                  }
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