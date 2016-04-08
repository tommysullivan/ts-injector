"use strict";
var ClusterInstaller = (function () {
    function ClusterInstaller(promiseFactory, serviceSet, clusterInstallerConfig) {
        this.promiseFactory = promiseFactory;
        this.serviceSet = serviceSet;
        this.clusterInstallerConfig = clusterInstallerConfig;
    }
    ClusterInstaller.prototype.verifyMapRNotInstalled = function (cluster) {
        return this.promiseFactory.newGroupPromise(cluster.nodes().map(function (n) { return n.verifyMapRNotInstalled(); }));
    };
    ClusterInstaller.prototype.prepareAndSaveConfiguration = function (cluster) {
        var _this = this;
        return cluster.newAuthedInstallerSession()
            .then(function (installerSession) { return installerSession.configuration(); })
            .then(function (installerConfiguration) {
            installerConfiguration
                .setClusterAdminPassword(_this.clusterInstallerConfig.adminPassword)
                .setClusterName(cluster.name)
                .setHosts(cluster.nodes().map(function (n) { return n.host; }))
                .setLicenseType(_this.clusterInstallerConfig.licenseType)
                .setSSHMethod(_this.clusterInstallerConfig.sshMethod)
                .setSSHPassword(_this.clusterInstallerConfig.sshPassword)
                .setSSHUsername(_this.clusterInstallerConfig.sshUsername)
                .setDisks(_this.clusterInstallerConfig.disks);
            _this.serviceSet.forEach(function (serviceConfig) {
                installerConfiguration.enableService(serviceConfig.name, serviceConfig.version);
            });
            return installerConfiguration.save();
        });
    };
    ClusterInstaller.prototype.services = function (cluster) {
        return cluster.newAuthedInstallerSession()
            .then(function (installerSession) {
            return installerSession.services();
        });
    };
    return ClusterInstaller;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterInstaller;
//# sourceMappingURL=cluster-installer.js.map