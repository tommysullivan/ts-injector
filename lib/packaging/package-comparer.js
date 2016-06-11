"use strict";
var PackageComparer = (function () {
    function PackageComparer() {
    }
    PackageComparer.prototype.equals = function (package1, package2) {
        return package1.name == package2.name
            && package1.version.matches(package2.version.toString())
            && package1.supportedOperatingSystems.containAll(package2.supportedOperatingSystems)
            && package2.supportedOperatingSystems.containAll(package1.supportedOperatingSystems)
            && package1.promotionLevel.equals(package2.promotionLevel)
            && package1.tags.containAll(package2.tags)
            && package2.tags.containAll(package1.tags);
    };
    return PackageComparer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageComparer;
//# sourceMappingURL=package-comparer.js.map