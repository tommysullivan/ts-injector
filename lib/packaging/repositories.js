"use strict";
var Repositories = (function () {
    function Repositories(repositoryJSONArray, packaging, packageSets) {
        this.repositoryJSONArray = repositoryJSONArray;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }
    Repositories.prototype.repositoryAtUrl = function (url) {
        return this.all.firstWhere(function (r) { return r.url == url; });
    };
    Object.defineProperty(Repositories.prototype, "all", {
        get: function () {
            var _this = this;
            return this.repositoryJSONArray.map(function (repositoryJSON) { return _this.packaging.newRepository(repositoryJSON, _this.packageSets); });
        },
        enumerable: true,
        configurable: true
    });
    Repositories.prototype.repositoryHosting = function (packageName, version, promotionLevel, operatingSystem) {
        var possibleRepositories = this.all.filter(function (r) { return r.packages.hasAtLeastOne(function (p) {
            return p.name == packageName
                && p.version.matches(version)
                && p.promotionLevel.name == promotionLevel
                && p.supportedOperatingSystems.contain(operatingSystem.toLowerCase());
        }); });
        if (possibleRepositories.length == 0) {
            throw new Error("specified package not hosted by any repository. " + packageName);
        }
        else if (possibleRepositories.hasMany) {
            throw new Error("specified package hosted by more than one repository. " + packageName);
        }
        return possibleRepositories.first();
    };
    return Repositories;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Repositories;
//# sourceMappingURL=repositories.js.map