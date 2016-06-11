"use strict";
var PackageSet = (function () {
    function PackageSet(configJSON, packaging, packageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }
    Object.defineProperty(PackageSet.prototype, "id", {
        get: function () {
            return this.configJSON.stringPropertyNamed('id');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageSet.prototype, "packages", {
        get: function () {
            return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(this.configJSON.listOfJSONObjectsNamed('packages'), this.packageSets);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageSet.prototype, "version", {
        get: function () {
            return this.packaging.newSemanticVersion(this.configJSON.stringPropertyNamed('version'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageSet.prototype, "promotionLevel", {
        get: function () {
            return this.packaging.newPromotionLevel(this.configJSON.stringPropertyNamed('promotionLevel'));
        },
        enumerable: true,
        configurable: true
    });
    return PackageSet;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageSet;
//# sourceMappingURL=package-set.js.map