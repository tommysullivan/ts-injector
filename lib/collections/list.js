"use strict";
var List = (function () {
    function List(listItems) {
        this.listItems = listItems || [];
    }
    List.prototype.all = function (predicate) {
        return this.filter(predicate).length == this.length;
    };
    List.prototype.contain = function (soughtItem) {
        return this.contains(soughtItem);
    };
    List.prototype.toString = function () {
        return this.toJSONString();
    };
    List.prototype.notEmpty = function () {
        return !this.isEmpty;
    };
    Object.defineProperty(List.prototype, "last", {
        get: function () {
            return this.itemAt(this.length - 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "isEmpty", {
        get: function () {
            return this.listItems.length == 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "length", {
        get: function () { return this.listItems.length; },
        enumerable: true,
        configurable: true
    });
    List.prototype.rest = function () {
        return new List(this.listItems.slice(1));
    };
    List.prototype.filter = function (filterFunction) {
        return new List(this.listItems.filter(filterFunction));
    };
    List.prototype.where = function (filterFunction) {
        return this.filter(filterFunction);
    };
    List.prototype.unique = function () {
        var uniqueList = new List();
        this.forEach(function (i) { return uniqueList.contains(i) ? null : uniqueList.push(i); });
        return uniqueList;
    };
    List.prototype.everythingAfterIndex = function (index) {
        return new List(this.toArray().slice(index + 1));
    };
    Object.defineProperty(List.prototype, "hasMany", {
        get: function () {
            return this.length > 1;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.toJSON = function () {
        var arr = this.toArray();
        return arr.map(function (i) { return (i != null && i.toJSON) ? i.toJSON() : i; });
    };
    List.prototype.first = function (exceptionMessage) {
        if (this.listItems.length == 0)
            throw new Error(exceptionMessage || 'Cannot get first item in empty list');
        return this.listItems[0];
    };
    List.prototype.map = function (mapFunction) {
        return new List(this.mapToArray(mapFunction));
    };
    List.prototype.mapToArray = function (mapFunction) {
        return this.listItems.map(mapFunction);
    };
    List.prototype.contains = function (soughtItem) {
        return this.listItems.indexOf(soughtItem) > -1;
    };
    List.prototype.containsAll = function (soughtItems) {
        var uniqueSoughtItems = soughtItems.unique();
        return this.filter(function (i) { return uniqueSoughtItems.contains(i); }).unique().length == uniqueSoughtItems.length;
    };
    List.prototype.containAll = function (soughtItems) { return this.containsAll(soughtItems); };
    List.prototype.push = function (item) {
        this.listItems.push(item);
        return this;
    };
    List.prototype.clone = function () {
        return new List(this.toArray());
    };
    List.prototype.toArray = function () {
        return this.listItems.map(function (i) { return i; });
    };
    List.prototype.forEach = function (eachFunction) {
        this.listItems.forEach(eachFunction);
        return this;
    };
    List.prototype.itemAt = function (index) {
        return this.listItems[index];
    };
    List.prototype.flatten = function () {
        var newList = new List();
        this.forEach(function (subArray) {
            var castedSubArray = subArray;
            newList = newList.append(castedSubArray);
        });
        return newList;
    };
    List.prototype.append = function (listToAppend) {
        var newList = this.clone();
        listToAppend.forEach(function (i) { return newList.push(i); });
        return newList;
    };
    List.prototype.firstWhere = function (predicate, exceptionMessage) {
        return this.filter(predicate).first(exceptionMessage);
    };
    List.prototype.join = function (separator) {
        return this.listItems.join(separator);
    };
    List.prototype.toJSONString = function () {
        var arrayOfAny = this.toArray();
        return JSON.stringify(arrayOfAny.map(function (i) { return i.toJSON ? i.toJSON() : i; }), null, 3);
    };
    List.prototype.sort = function () {
        return new List(this.toArray().sort());
    };
    List.prototype.sortWith = function (comparator) {
        return new List(this.toArray().sort(comparator));
    };
    List.prototype.flatMap = function (mapFunction) {
        return this.map(mapFunction).flatten();
    };
    List.prototype.flatMapArray = function (mapFunction) {
        return new List(this.mapToArray(mapFunction)).flatten();
    };
    List.prototype.limitTo = function (maxResults) {
        return new List(this.listItems.slice(Math.max(this.length - maxResults, 0)));
    };
    List.prototype.hasAtLeastOne = function (predicate) {
        return !this.filter(predicate).isEmpty;
    };
    return List;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = List;
//# sourceMappingURL=list.js.map