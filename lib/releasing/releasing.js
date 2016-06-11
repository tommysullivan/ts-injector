"use strict";
var release_1 = require("./release");
var releases_1 = require("./releases");
var phase_1 = require("./phase");
var Releasing = (function () {
    function Releasing(packaging, configJSON) {
        this.packaging = packaging;
        this.configJSON = configJSON;
    }
    Releasing.prototype.newReleases = function (listOfReleasesJSONObjects, packageSets) {
        return new releases_1.default(this, listOfReleasesJSONObjects, packageSets);
    };
    Releasing.prototype.newRelease = function (configJSON, packageSets) {
        return new release_1.default(configJSON, this, packageSets);
    };
    Releasing.prototype.newPhase = function (phaseJSON, packageSets) {
        return new phase_1.default(phaseJSON, this.packaging, packageSets);
    };
    Object.defineProperty(Releasing.prototype, "defaultReleases", {
        get: function () {
            return this.newReleases(this.configJSON.listOfJSONObjectsNamed('releases'), this.packaging.defaultPackageSets);
        },
        enumerable: true,
        configurable: true
    });
    return Releasing;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Releasing;
//# sourceMappingURL=releasing.js.map