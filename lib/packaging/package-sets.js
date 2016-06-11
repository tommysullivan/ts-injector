"use strict";
var PackageSets = (function () {
    function PackageSets(listOfPackageSetJSONs, packaging) {
        this.listOfPackageSetJSONs = listOfPackageSetJSONs;
        this.packaging = packaging;
    }
    PackageSets.prototype.setWithIdAndVersion = function (soughtId, version) {
        return this.all.firstWhere(function (p) { return p.id == soughtId && p.version.matches(version.toString()); });
    };
    Object.defineProperty(PackageSets.prototype, "all", {
        get: function () {
            var _this = this;
            return this.listOfPackageSetJSONs.map(function (packageSetJSON) { return _this.packaging.newPackageSet(packageSetJSON, _this); });
        },
        enumerable: true,
        configurable: true
    });
    return PackageSets;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageSets;
//# sourceMappingURL=package-sets.js.map