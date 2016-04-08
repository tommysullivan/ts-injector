"use strict";
var Dictionary = (function () {
    function Dictionary(hash, collections) {
        this.hash = hash;
        this.collections = collections;
    }
    Dictionary.prototype.add = function (key, value) {
        this.hash[key] = value;
        return this;
    };
    Dictionary.prototype.hasKey = function (key) {
        return this.hash.hasOwnProperty(key);
    };
    Dictionary.prototype.get = function (key) {
        return this.hash[key];
    };
    Dictionary.prototype.getOrThrow = function (key, errorMessageIfNotExist) {
        if (this.hash.hasOwnProperty(key))
            return this.get(key);
        else
            throw new Error((errorMessageIfNotExist || 'Error') + " - sought key was \"" + key + "\"");
    };
    Object.defineProperty(Dictionary.prototype, "keys", {
        get: function () {
            return this.collections.newList(Object.keys(this.hash));
        },
        enumerable: true,
        configurable: true
    });
    Dictionary.prototype.toJSON = function () {
        return JSON.parse(JSON.stringify(this.hash));
    };
    Dictionary.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    Dictionary.prototype.clone = function () {
        return this.collections.newDictionary(this.toJSON());
    };
    return Dictionary;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dictionary;
//# sourceMappingURL=dictionary.js.map