"use strict";
var PackageFromLiterals = (function () {
    function PackageFromLiterals(name, version, promotionLevel, supportedOperatingSystems, packageComparer, tags) {
        this.name = name;
        this.version = version;
        this.promotionLevel = promotionLevel;
        this.supportedOperatingSystems = supportedOperatingSystems;
        this.packageComparer = packageComparer;
        this.tags = tags;
    }
    PackageFromLiterals.prototype.equals = function (other) {
        return this.packageComparer.equals(this, other);
    };
    return PackageFromLiterals;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageFromLiterals;
//# sourceMappingURL=package-from-literals.js.map