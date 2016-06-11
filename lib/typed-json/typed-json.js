"use strict";
var json_object_1 = require("./json-object");
var TypedJSON = (function () {
    function TypedJSON(spacingForStringify, collections) {
        this.spacingForStringify = spacingForStringify;
        this.collections = collections;
    }
    TypedJSON.prototype.newJSONObject = function (rawJSONObject) {
        return new json_object_1.default(rawJSONObject, this.spacingForStringify, this.collections, this);
    };
    TypedJSON.prototype.newListOfJSONObjects = function (rawArray) {
        var _this = this;
        return this.collections.newList(rawArray.map(function (o) { return _this.newJSONObject(o); }));
    };
    TypedJSON.prototype.isArray = function (potentialArray) {
        return (Object.prototype.toString.call(potentialArray) == '[object Array]');
    };
    return TypedJSON;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypedJSON;
//# sourceMappingURL=typed-json.js.map