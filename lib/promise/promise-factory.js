"use strict";
var PromiseFactory = (function () {
    function PromiseFactory(promiseModule, collections) {
        this.promiseModule = promiseModule;
        this.collections = collections;
    }
    PromiseFactory.prototype.newPromiseForImmediateValue = function (value) {
        return this.promiseModule.resolve(value);
    };
    PromiseFactory.prototype.newPromise = function (resolver) {
        return new this.promiseModule(resolver);
    };
    PromiseFactory.prototype.newGroupPromiseFromArray = function (promises) {
        var _this = this;
        return this.promiseModule.all(promises)
            .then(function (arrayOfResolvedValues) { return _this.collections.newList(arrayOfResolvedValues); });
    };
    PromiseFactory.prototype.newGroupPromise = function (promises) {
        return this.newGroupPromiseFromArray(promises.toArray());
    };
    PromiseFactory.prototype.newPromiseForRejectedImmediateValue = function (value) {
        return this.promiseModule.reject(value);
    };
    return PromiseFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PromiseFactory;
//# sourceMappingURL=promise-factory.js.map