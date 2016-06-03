"use strict";
var JSONObject = (function () {
    function JSONObject(jsonObject, spacingForStringify, collections, typedJSON) {
        this.jsonObject = jsonObject;
        this.spacingForStringify = spacingForStringify;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }
    JSONObject.prototype.throwPropertyWrongTypeError = function (name, expectedTypeName, actualTypeName) {
        throw new Error("Property \"" + name + "\" should be \"" + expectedTypeName + "\" but was a(n) " + actualTypeName + " in configuration: " + this.toString());
    };
    JSONObject.prototype.getTypedProperty = function (name, expectedTypeName) {
        var val = this.getProperty(name);
        var actualTypeName = typeof (val);
        if (actualTypeName != expectedTypeName)
            this.throwPropertyWrongTypeError(name, expectedTypeName, actualTypeName);
        return val;
    };
    JSONObject.prototype.hasPropertyNamed = function (propertyName) {
        return this.jsonObject.hasOwnProperty(propertyName);
    };
    JSONObject.prototype.getProperty = function (name) {
        if (!this.hasPropertyNamed(name))
            throw new Error("Missing property \"" + name + "\" in configuration: " + this.toString());
        return this.jsonObject[name];
    };
    JSONObject.prototype.jsonObjectNamed = function (name) {
        return this.typedJSON.newJSONObject(this.getProperty(name));
    };
    JSONObject.prototype.listOfJSONObjectsNamed = function (name) {
        var _this = this;
        return this.listNamed(name).map(function (i) { return _this.typedJSON.newJSONObject(i); });
    };
    JSONObject.prototype.listOfJSONObjectsNamedOrDefaultToEmpty = function (name) {
        try {
            return this.listOfJSONObjectsNamed(name);
        }
        catch (e) {
            return this.collections.newEmptyList();
        }
    };
    JSONObject.prototype.dictionaryNamed = function (name) {
        var rawObject = this.getTypedProperty(name, 'object');
        return this.collections.newDictionary(rawObject);
    };
    JSONObject.prototype.setProperty = function (name, value) {
        this.jsonObject[name] = value;
        return this;
    };
    JSONObject.prototype.stringPropertyNamed = function (name) {
        return this.getTypedProperty(name, 'string');
    };
    JSONObject.prototype.numericPropertyNamed = function (name) {
        return this.getTypedProperty(name, 'number');
    };
    JSONObject.prototype.booleanPropertyNamed = function (name) {
        return this.getTypedProperty(name, 'boolean');
    };
    JSONObject.prototype.toRawJSON = function () {
        return JSON.parse(JSON.stringify(this.jsonObject));
    };
    JSONObject.prototype.toString = function () {
        return JSON.stringify(this.jsonObject, null, this.spacingForStringify);
    };
    JSONObject.prototype.listNamed = function (name) {
        var rawArray = this.getProperty(name);
        if (!this.typedJSON.isArray(rawArray))
            this.throwPropertyWrongTypeError(name, 'array', 'unknown (but not native array)');
        return this.collections.newList(rawArray);
    };
    JSONObject.prototype.listNamedOrDefaultToEmpty = function (name) {
        return this.hasPropertyNamed(name)
            ? this.listNamed(name)
            : this.collections.newEmptyList();
    };
    return JSONObject;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JSONObject;
//# sourceMappingURL=json-object.js.map