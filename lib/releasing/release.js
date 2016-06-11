"use strict";
var Release = (function () {
    function Release(configJSON, releasing, packageSets) {
        this.configJSON = configJSON;
        this.releasing = releasing;
        this.packageSets = packageSets;
    }
    Object.defineProperty(Release.prototype, "name", {
        get: function () { return this.configJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Release.prototype, "phases", {
        get: function () {
            var _this = this;
            return this.configJSON.listOfJSONObjectsNamed('phases').map(function (phaseJSON) { return _this.releasing.newPhase(phaseJSON, _this.packageSets); });
        },
        enumerable: true,
        configurable: true
    });
    Release.prototype.phaseNamed = function (name) {
        return this.phases.firstWhere(function (r) { return r.name == name; });
    };
    return Release;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Release;
//# sourceMappingURL=release.js.map