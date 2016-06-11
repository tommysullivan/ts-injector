"use strict";
var PackageSetReference = (function () {
    function PackageSetReference(configJSON, packaging, packageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }
    Object.defineProperty(PackageSetReference.prototype, "referredPackageSetId", {
        get: function () {
            return this.configJSON.stringPropertyNamed('packageSetRef');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageSetReference.prototype, "id", {
        get: function () { return "reference-to-" + this.referredPackageSetId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageSetReference.prototype, "version", {
        get: function () { return this.packaging.newSemanticVersion(this.configJSON.stringPropertyNamed('version')); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageSetReference.prototype, "packages", {
        get: function () {
            var _this = this;
            return this.packageSets.setWithIdAndVersion(this.referredPackageSetId, this.version).packages.map(function (originalPackage) { return _this.packaging.newPackageWithOverrides(originalPackage, _this.configJSON.hasPropertyNamed('operatingSystems')
                ? _this.configJSON.listNamed('operatingSystems')
                : null, _this.configJSON.hasPropertyNamed('promotionLevel')
                ? _this.packaging.newPromotionLevel(_this.configJSON.stringPropertyNamed('promotionLevel'))
                : null, _this.configJSON.hasPropertyNamed('tags')
                ? _this.configJSON.listNamed('tags').clone()
                : null); });
        },
        enumerable: true,
        configurable: true
    });
    return PackageSetReference;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageSetReference;
//# sourceMappingURL=package-set-reference.js.map