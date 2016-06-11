"use strict";
var Releases = (function () {
    function Releases(releasing, listOfReleaseJSONs, packageSets) {
        this.releasing = releasing;
        this.listOfReleaseJSONs = listOfReleaseJSONs;
        this.packageSets = packageSets;
    }
    Releases.prototype.releaseNamed = function (releaseName) {
        return this.all.firstWhere(function (r) { return r.name == releaseName; });
    };
    Object.defineProperty(Releases.prototype, "all", {
        get: function () {
            var _this = this;
            return this.listOfReleaseJSONs.map(function (releaseJSON) { return _this.releasing.newRelease(releaseJSON, _this.packageSets); });
        },
        enumerable: true,
        configurable: true
    });
    return Releases;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Releases;
//# sourceMappingURL=releases.js.map