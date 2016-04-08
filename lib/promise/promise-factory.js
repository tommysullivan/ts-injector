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
    PromiseFactory.prototype.newGroupPromise = function (promises) {
        var _this = this;
        return this.promiseModule.all(promises.toArray())
            .then(function (arrayOfResolvedValues) { return _this.collections.newList(arrayOfResolvedValues); });
    };
    PromiseFactory.prototype.newPromiseForRejectedImmediateValue = function (value) {
        return this.promiseModule.reject(value);
    };
    return PromiseFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PromiseFactory;
//# sourceMappingURL=promise-factory.js.map