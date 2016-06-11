"use strict";
var ClusterInstaller = (function () {
    function ClusterInstaller(promiseFactory, clusterInstallerConfig) {
        this.promiseFactory = promiseFactory;
        this.clusterInstallerConfig = clusterInstallerConfig;
    }
    ClusterInstaller.prototype.verifyMapRNotInstalled = function (cluster) {
        return this.promiseFactory.newGroupPromise(cluster.nodes().map(function (n) { return n.verifyMapRNotInstalled(); }));
    };
    ClusterInstaller.prototype.prepareAndSaveConfiguration = function (cluster) {
        throw new Error('disabled - requires updates to ensure correct packages installed to correct nodes');
        // return cluster.newAuthedInstallerSession()
        //     .then(installerSession=>installerSession.configuration())
        //     .then(installerConfiguration=>{
        //         installerConfiguration
        //             .setClusterAdminPassword(this.clusterInstallerConfig.adminPassword)
        //             .setClusterName(cluster.name)
        //             .setHosts(cluster.nodes().map(n=>n.host))
        //             .setLicenseType(this.clusterInstallerConfig.licenseType)
        //             .setSSHMethod(this.clusterInstallerConfig.sshMethod)
        //             .setSSHPassword(this.clusterInstallerConfig.sshPassword)
        //             .setSSHUsername(this.clusterInstallerConfig.sshUsername)
        //             .setDisks(this.clusterInstallerConfig.disks);
        //
        //         // this.serviceSet.forEach(serviceConfig => {
        //         //     installerConfiguration.enableService(serviceConfig.name, serviceConfig.version);
        //         // });
        //
        //         return installerConfiguration.save();
        //     });
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