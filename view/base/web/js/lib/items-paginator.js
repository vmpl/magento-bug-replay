/*eslint-disable */
/* jscs:disable */
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
define(["module", "VMPL_BugReplay/js/lib/worker/decorator"], function (module, _decorator) {
  var _dec, _class, _dec2, _class2;
  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
  var CompareTypes = /*#__PURE__*/function (CompareTypes) {
    CompareTypes[CompareTypes["equal"] = 0] = "equal";
    CompareTypes[CompareTypes["in"] = 1] = "in";
    CompareTypes[CompareTypes["less"] = 2] = "less";
    CompareTypes[CompareTypes["more"] = 3] = "more";
    CompareTypes[CompareTypes["regex"] = 4] = "regex";
    return CompareTypes;
  }(CompareTypes || {});
  var CompareType = (_dec = (0, _decorator.WorkerArgument)(module.id), _dec(_class = /*#__PURE__*/function () {
    "use strict";

    function CompareType(type) {
      if (type === void 0) {
        type = CompareTypes.equal;
      }
      this.type = type;
      this.type = type;
    }
    var _proto = CompareType.prototype;
    _proto.match = function match(item, against) {
      switch (this.type) {
        case CompareTypes.equal:
          return item == against;
        case CompareTypes.in:
          return against.includes(item);
        case CompareTypes.less:
          return item < against;
        case CompareTypes.more:
          return item > against;
        case CompareTypes.regex:
          return against.test(item);
        default:
          throw new Error("Case not implemented: " + this.type);
      }
    };
    return CompareType;
  }()) || _class);
  var PaginatorFilter = (_dec2 = (0, _decorator.WorkerArgument)(module.id), _dec2(_class2 = /*#__PURE__*/function () {
    "use strict";

    function PaginatorFilter(property, value, compare, and, groups) {
      if (property === void 0) {
        property = null;
      }
      if (value === void 0) {
        value = undefined;
      }
      if (compare === void 0) {
        compare = new CompareType(CompareTypes.equal);
      }
      if (and === void 0) {
        and = true;
      }
      if (groups === void 0) {
        groups = [];
      }
      this.property = property;
      this.value = value;
      this.compare = compare;
      this.and = and;
      this.groups = groups;
    }
    var _proto2 = PaginatorFilter.prototype;
    _proto2.append = function append() {
      var _this$groups;
      (_this$groups = this.groups).push.apply(_this$groups, arguments);
      return this;
    };
    _proto2.match = function match(items) {
      return items.filter(this.matchItem.bind(this));
    };
    _proto2.matchItem = function matchItem(item) {
      var groupsMatched = this.groups.map(function (it) {
        return it.matchItem(item);
      });
      if (this.property) {
        if (!item.hasOwnProperty(this.property)) {
          throw new Error("item do not have property named: " + this.property.toString());
        }
        groupsMatched.push(this.compare.match(this.getItemValue(item, this.property), this.value));
      }
      return this.and ? !groupsMatched.includes(false) : groupsMatched.includes(true);
    };
    _proto2.getItemValue = function getItemValue(item, property) {
      var propertyComponents = property.split('.');
      var itemProperty = propertyComponents.shift();
      var itemValue = item.hasOwnProperty(itemProperty) ? item[itemProperty] : undefined;
      return propertyComponents.length === 0 ? itemValue : this.getItemValue(itemValue, propertyComponents.join('.'));
    };
    return PaginatorFilter;
  }()) || _class2);
  var _default = /*#__PURE__*/function () {
    "use strict";

    function _default(items, loader) {
      this._filter = new PaginatorFilter();
      this._page = 1;
      this._size = 5;
      this.items = items;
      this.loader = loader;
    }
    var _proto3 = _default.prototype;
    _proto3.loadPage = function loadPage() {
      var _this = this;
      var offset = (this._page - 1) * this._size;
      var limit = offset + this._size;

      // @ts-ignore
      if (!this.items.length || this.items.slice(offset, limit).includes()) {
        return this.loader.loadPaginatorItems(offset, this._size, this._filter).then(function (response) {
          _this.items.length || (_this.items = new Array(response.meta.totalRecords));
          response.items.forEach(function (item, index) {
            _this.items[offset + index] = item;
          });
        });
      }
      return Promise.resolve();
    };
    _proto3.fetch = function fetch(atIndex) {
      var _this2 = this;
      this.page = Number((atIndex / this._size).toFixed()) + 1;
      return this.loadPage().then(function () {
        return _this2.items[atIndex];
      });
    };
    _proto3.clear = function clear() {
      this._page = 1;
      this.items = [];
    };
    _proto3.forEach = function forEach(each) {
      var _this3 = this;
      var index = 0;
      var next = function next() {
        return _this3.fetch(index++).then(function (it) {
          return !each || each(it, index);
        }).then(function () {
          if (index < _this3.items.length) {
            return next();
          }
        });
      };
      return next();
    };
    _proto3.all = function all() {
      var _this4 = this;
      return this.forEach().then(function () {
        return _this4.items;
      });
    };
    _proto3.getPage = function getPage() {
      var _this5 = this;
      var offset = (this._page - 1) * this._size;
      var limit = offset + this._size;
      return this.loadPage().then(function () {
        var items = _this5.items.slice(offset, limit);
        if (!items.length) {
          throw new Error('None');
        }
        return items;
      });
    };
    _createClass(_default, [{
      key: "page",
      get: function get() {
        return this._page;
      },
      set: function set(value) {
        if (!(value > 0)) {
          throw new Error("Page cannot be lower then 1, given " + value);
        }
        this._page = value;
      }
    }, {
      key: "size",
      set: function set(value) {
        if (value <= 0) {
          throw new Error('Size have to be greater then 0.');
        }
        if (this.items.length && this.items.length > value) {
          throw new Error('Size is greater then records found');
        }
        this._size = value;
      }
    }, {
      key: "filter",
      set: function set(value) {
        this.page = 1;
        this.items = [];
        this._filter.append(value);
      }
    }]);
    return _default;
  }();
  return Object.assign(_default, {
    CompareType: CompareType,
    PaginatorFilter: PaginatorFilter
  });
});
//# sourceMappingURL=items-paginator.js.map