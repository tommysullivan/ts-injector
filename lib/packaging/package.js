"use strict";
var Package = (function () {
    function Package(configJSON, packaging, packageComparer) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageComparer = packageComparer;
    }
    Object.defineProperty(Package.prototype, "name", {
        get: function () {
            return this.configJSON.hasPropertyNamed('name')
                ? this.configJSON.stringPropertyNamed('name')
                : this.configJSON.stringPropertyNamed('package');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "version", {
        get: function () {
            return this.packaging.newSemanticVersion(this.configJSON.stringPropertyNamed('version'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "promotionLevel", {
        get: function () {
            return this.packaging.newPromotionLevel(this.configJSON.stringPropertyNamed('promotionLevel'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Package.prototype, "supportedOperatingSystems", {
        get: function () {
            return this.configJSON.listNamed('operatingSystems');
        },
        enumerable: true,
        configurable: true
    });
    Package.prototype.equals = function (other) {
        return this.packageComparer.equals(this, other);
    };
    Object.defineProperty(Package.prototype, "tags", {
        get: function () {
            return this.configJSON.listNamedOrDefaultToEmpty('tags');
        },
        enumerable: true,
        configurable: true
    });
    return Package;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Package;
//# sourceMappingURL=package.js.map