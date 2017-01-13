import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IInstallerServices} from "./i-installer-services";
import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {IClusterInstaller} from "./i-cluster-installer";
import {ICluster} from "../clusters/i-cluster";
import {IFuture} from "../futures/i-future";

export class ClusterInstaller implements IClusterInstaller {
    verifyMapRNotInstalled(cluster:ICluster):IFuture<IList<ISSHResult>> {
        return cluster.nodes.mapToFutureList(n=>n.verifyMapRNotInstalled())
    }

    prepareAndSaveConfiguration(cluster:ICluster):IFuture<IInstallerServerConfiguration> {
        throw new Error('disabled - requires updates to ensure correct packages installed to correct nodes');
    }

    services(cluster:ICluster):IFuture<IInstallerServices> {
        return cluster.newAuthedInstallerSession()
            .then(installerSession=>{
                return installerSession.services();
            });
    }
}