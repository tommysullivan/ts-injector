"use strict";
var PackageWithOverrides = (function () {
    function PackageWithOverrides(originalPackage, operatingSystemsOverride, promotionLevelOverride, packageComparer, tagsOverride) {
        this.originalPackage = originalPackage;
        this.operatingSystemsOverride = operatingSystemsOverride;
        this.promotionLevelOverride = promotionLevelOverride;
        this.packageComparer = packageComparer;
        this.tagsOverride = tagsOverride;
    }
    Object.defineProperty(PackageWithOverrides.prototype, "name", {
        get: function () { return this.originalPackage.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageWithOverrides.prototype, "version", {
        get: function () { return this.originalPackage.version; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageWithOverrides.prototype, "promotionLevel", {
        get: function () { return this.promotionLevelOverride ? this.promotionLevelOverride : this.originalPackage.promotionLevel; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageWithOverrides.prototype, "supportedOperatingSystems", {
        get: function () { return this.operatingSystemsOverride ? this.operatingSystemsOverride : this.originalPackage.supportedOperatingSystems; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageWithOverrides.prototype, "tags", {
        get: function () { return this.tagsOverride ? this.tagsOverride : this.originalPackage.tags; },
        enumerable: true,
        configurable: true
    });
    PackageWithOverrides.prototype.equals = function (other) {
        return this.packageComparer.equals(this, other);
    };
    return PackageWithOverrides;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageWithOverrides;
//# sourceMappingURL=package-with-overrides.js.map