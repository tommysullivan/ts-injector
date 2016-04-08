"use strict";
var FeatureSet = (function () {
    function FeatureSet(configJSON) {
        this.configJSON = configJSON;
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
            return this.configJSON.listNamed('featureFilePaths');
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