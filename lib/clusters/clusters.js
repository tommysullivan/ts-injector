"use strict";
var cluster_configuration_1 = require("./cluster-configuration");
var Clusters = (function () {
    function Clusters(clusterJSONs, esxi, errors, collections) {
        this.clusterJSONs = clusterJSONs;
        this.esxi = esxi;
        this.errors = errors;
        this.collections = collections;
    }
    Clusters.prototype.clusterConfigurationWithId = function (id) {
        try {
            return this.allConfigurations.firstWhere(function (c) { return c.id == id; });
        }
        catch (e) {
            throw this.errors.newErrorWithCause(e, "Failed to find configuration with id \"" + id + "\"");
        }
    };
    Clusters.prototype.allIds = function () {
        return this.allConfigurations.map(function (c) { return c.id; });
    };
    Object.defineProperty(Clusters.prototype, "allConfigurations", {
        get: function () {
            var _this = this;
            return this.clusterJSONs.map(function (clusterConfigJSON) { return _this.newClusterConfiguration(clusterConfigJSON); });
        },
        enumerable: true,
        configurable: true
    });
    Clusters.prototype.newClusterConfiguration = function (clusterConfigJSON) {
        return new cluster_configuration_1.default(clusterConfigJSON, this.esxi, this.collections);
    };
    return Clusters;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Clusters;
//# sourceMappingURL=clusters.js.map