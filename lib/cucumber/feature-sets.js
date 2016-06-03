"use strict";
var FeatureSets = (function () {
    function FeatureSets(featureSetsJSONArray, cucumber) {
        this.featureSetsJSONArray = featureSetsJSONArray;
        this.cucumber = cucumber;
    }
    FeatureSets.prototype.setWithId = function (id) {
        return this.all.firstWhere(function (f) { return f.id == id; });
    };
    Object.defineProperty(FeatureSets.prototype, "all", {
        get: function () {
            var _this = this;
            return this.featureSetsJSONArray.map(function (configJSON) { return _this.cucumber.newFeatureSet(configJSON, _this); });
        },
        enumerable: true,
        configurable: true
    });
    return FeatureSets;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FeatureSets;
//# sourceMappingURL=feature-sets.js.map