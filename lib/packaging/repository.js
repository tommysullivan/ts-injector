"use strict";
var Repository = (function () {
    function Repository(configJSON, packaging, packageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }
    Object.defineProperty(Repository.prototype, "url", {
        get: function () {
            return this.configJSON.stringPropertyNamed('url');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Repository.prototype, "packages", {
        get: function () {
            return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(this.configJSON.listOfJSONObjectsNamed('packages'), this.packageSets);
        },
        enumerable: true,
        configurable: true
    });
    return Repository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Repository;
//# sourceMappingURL=repository.js.map