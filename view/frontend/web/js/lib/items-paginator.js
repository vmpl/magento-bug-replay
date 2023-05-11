/*eslint-disable */
/* jscs:disable */
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
define(["VMPL_BugReplay/js/lib/decorator/worker-class", "module"], function (_workerClass, module) {
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
  var CompareType = (_dec = (0, _workerClass.injectableArgument)(module.uri, module.id), _dec(_class = /*#__PURE__*/function () {
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
  var PaginatorFilter = (_dec2 = (0, _workerClass.injectableArgument)(module.uri, module.id), _dec2(_class2 = /*#__PURE__*/function () {
    "use strict";

    function PaginatorFilter(and, property, compare, value, groups) {
      if (and === void 0) {
        and = true;
      }
      if (property === void 0) {
        property = null;
      }
      if (compare === void 0) {
        compare = new CompareType(CompareTypes.equal);
      }
      if (value === void 0) {
        value = undefined;
      }
      if (groups === void 0) {
        groups = [];
      }
      this.and = and;
      this.property = property;
      this.compare = compare;
      this.value = value;
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
      if (!item.hasOwnProperty(this.property)) {
        throw new Error("item do not have property named: " + this.property.toString());
      }
      var groupsMatched = this.groups.map(function (it) {
        return it.matchItem(item);
      });
      groupsMatched.push(this.compare.match(this.getItemValue(item, this.property), this.value));
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
      this._size = 20;
      this.totalRecords = undefined;
      this.items = items;
      this.loader = loader;
    }
    var _proto3 = _default.prototype;
    _proto3.getCurrentPage = function getCurrentPage() {
      var _this = this;
      var offset = (this._page - 1) * this._size;
      var limit = this._size;
      if (offset >= this.items.length) {
        var leftChunk = this.items.slice(0, offset);
        var rightChunk = this.items.slice(offset + limit);
        return this.loader.loadPaginatorItems(offset, limit, this._filter).then(function (response) {
          _this.totalRecords = response.meta.totalRecords;
          _this.items = [].concat(leftChunk, response.items, rightChunk);
          return response.items;
        });
      }
      return Promise.resolve(this.items.slice(offset, limit));
    };
    _createClass(_default, [{
      key: "page",
      set: function set(value) {
        if (!(this._page > 0)) {
          throw new Error('Page cannot be lower then 1.');
        }
        if (value > this.lastPage) {
          throw new Error('Page cannot be greater then lastPage.');
        }
        this._page = value;
      }
    }, {
      key: "size",
      set: function set(value) {
        if (value <= 0) {
          throw new Error('Size have to be greater then 0.');
        }
        if (this.totalRecords !== undefined && this.totalRecords > value) {
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
    }, {
      key: "lastPage",
      get: function get() {
        var lastPage = this.totalRecords / this._size;
        lastPage += this.totalRecords % this._size ? 1 : 0;
        return lastPage;
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