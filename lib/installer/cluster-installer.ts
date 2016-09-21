import {IFuture} from "../promise/i-future";
import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IInstallerServices} from "../installer/i-installer-services";
import {IInstallerServerConfiguration} from "../installer/i-installer-server-configuration";
import {IClusterInstallerConfig} from "./i-cluster-installer-config";
import {IClusterInstaller} from "./i-cluster-installer";
import {IClusterUnderTest} from "../cluster-testing/i-cluster-under-test";

export class ClusterInstaller implements IClusterInstaller {
    constructor(
        private promiseFactory:IPromiseFactory,
        private clusterInstallerConfig:IClusterInstallerConfig
    ) {}

    verifyMapRNotInstalled(cluster:IClusterUnderTest):IFuture<IList<ISSHResult>> {
        return this.promiseFactory.newGroupPromise(
            cluster.nodes.map(n=>n.verifyMapRNotInstalled())
        );
    }

    prepareAndSaveConfiguration(cluster:IClusterUnderTest):IFuture<IInstallerServerConfiguration> {
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
    }

    services(cluster:IClusterUnderTest):IFuture<IInstallerServices> {
        return cluster.newAuthedInstallerSession()
            .then(installerSession=>{
                return installerSession.services();
            });
    }
}