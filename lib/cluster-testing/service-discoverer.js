"use strict";
var ServiceDiscoverer = (function () {
    function ServiceDiscoverer(versioning, promiseFactory, errors) {
        this.versioning = versioning;
        this.promiseFactory = promiseFactory;
        this.errors = errors;
    }
    ServiceDiscoverer.prototype.nodesHostingServiceViaDiscovery = function (clusterUnderTest, serviceName) {
        var possibleHostNodes = clusterUnderTest.nodesHosting(serviceName);
        return possibleHostNodes.isEmpty
            ? this.nodesHostingServiceAccordingToInstaller(clusterUnderTest, serviceName)
            : this.promiseFactory.newPromiseForImmediateValue(possibleHostNodes);
    };
    ServiceDiscoverer.prototype.nodesHostingServiceAccordingToInstaller = function (clusterUnderTest, serviceName) {
        try {
            var desiredVersion = this.versioning.serviceSet().firstWhere(function (s) { return s.name == serviceName; }).version;
            return clusterUnderTest.newAuthedInstallerSession()
                .then(function (installerRestSession) { return installerRestSession.services(); })
                .then(function (services) {
                var serviceAccordingToInstaller = services.serviceMatchingNameAndVersion(serviceName, desiredVersion);
                return serviceAccordingToInstaller.hostNames();
            })
                .then(function (hostNames) { return hostNames.map(function (hostName) { return clusterUnderTest.nodeWithHostName(hostName); }); });
        }
        catch (e) {
            throw this.errors.newErrorWithCause(e, "Could not use installer service to discover \"" + serviceName + "\" for cluster " + clusterUnderTest.name);
        }
    };
    ServiceDiscoverer.prototype.nodeHostingServiceViaDiscover = function (clusterUnderTest, serviceName) {
        return this.nodesHostingServiceViaDiscovery(clusterUnderTest, serviceName)
            .then(function (possibleNodes) {
            return possibleNodes.first();
            // if(possibleNodes.hasMany)
            //     // throw this.errors.newErrorWithJSONDetails(
            //     //     `Ambiguous request to discover node hosting service "${serviceName}"`,
            //     //     possibleNodes.toJSON()
            //     // );
            // else return possibleNodes.first();
        });
    };
    return ServiceDiscoverer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceDiscoverer;
//# sourceMappingURL=service-discoverer.js.map