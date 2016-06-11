"use strict";
var FeatureSet = (function () {
    function FeatureSet(configJSON, collections, featureSets) {
        this.configJSON = configJSON;
        this.collections = collections;
        this.featureSets = featureSets;
    }
    Object.defineProperty(FeatureSet.prototype, "id", {
        get: function () {
            return this.configJSON.stringPropertyNamed('id');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeatureSet.prototype, "featureFilesInExecutionOrder", {
        get: function () {
            var _this = this;
            return this.configJSON.listOfJSONObjectsNamed('features').flatMap(function (f) { return f.hasPropertyNamed('file')
                ? _this.collections.newList([f.stringPropertyNamed('file')])
                : _this.featureSets.setWithId(f.stringPropertyNamed('featureSetRef')).featureFilesInExecutionOrder; });
        },
        enumerable: true,
        configurable: true
    });
    FeatureSet.prototype.toJSON = function () { return this.configJSON.toRawJSON(); };
    FeatureSet.prototype.toString = function () { return this.configJSON.toString(); };
    return FeatureSet;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FeatureSet;
//# sourceMappingURL=feature-set.js.map