"use strict";
var Phase = (function () {
    function Phase(configJSON, packaging, packageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }
    Object.defineProperty(Phase.prototype, "name", {
        get: function () { return this.configJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    Phase.prototype.packagesForOperatingSystem = function (operatingSystemName) {
        return this.packages.filter(function (p) { return p.supportedOperatingSystems.contain(operatingSystemName.toLowerCase()); });
    };
    Object.defineProperty(Phase.prototype, "packages", {
        get: function () {
            return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(this.configJSON.listOfJSONObjectsNamed('packages'), this.packageSets);
        },
        enumerable: true,
        configurable: true
    });
    return Phase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Phase;
//# sourceMappingURL=phase.js.map