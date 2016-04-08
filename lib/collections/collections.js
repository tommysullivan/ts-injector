"use strict";
var list_1 = require("./list");
var dictionary_1 = require("./dictionary");
var Collections = (function () {
    function Collections() {
    }
    Collections.prototype.newList = function (items) {
        if (items === void 0) { items = []; }
        return new list_1.default(items);
    };
    Collections.prototype.newEmptyList = function () {
        return this.newList();
    };
    Collections.prototype.newDictionary = function (initialItems) {
        return new dictionary_1.default(initialItems, this);
    };
    Collections.prototype.newEmptyDictionary = function () {
        return new dictionary_1.default([], this);
    };
    return Collections;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Collections;
//# sourceMappingURL=collections.js.map