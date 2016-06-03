import IClusterUnderTest from "./i-cluster-under-test";
import IThenable from "../promise/i-thenable";
import IList from "../collections/i-list";
import ISSHResult from "../ssh/i-ssh-result";
import IPromiseFactory from "../promise/i-promise-factory";
import ClusterInstallerConfig from "./cluster-installer-config";
import IInstallerServices from "../installer/i-installer-services";
import IInstallerServerConfiguration from "../installer/i-installer-server-configuration";

export default class ClusterInstaller {
    private promiseFactory:IPromiseFactory;
    private clusterInstallerConfig:ClusterInstallerConfig;

    constructor(promiseFactory:IPromiseFactory, clusterInstallerConfig:ClusterInstallerConfig) {
        this.promiseFactory = promiseFactory;
        this.clusterInstallerConfig = clusterInstallerConfig;
    }

    verifyMapRNotInstalled(cluster:IClusterUnderTest):IThenable<IList<ISSHResult>> {
        return this.promiseFactory.newGroupPromise(
            cluster.nodes().map(n=>n.verifyMapRNotInstalled())
        );
    }

    prepareAndSaveConfiguration(cluster:IClusterUnderTest):IThenable<IInstallerServerConfiguration> {
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

    services(cluster:IClusterUnderTest):IThenable<IInstallerServices> {
        return cluster.newAuthedInstallerSession()
            .then(installerSession=>{
                return installerSession.services();
            });
    }
}