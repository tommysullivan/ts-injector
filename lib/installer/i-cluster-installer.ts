import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {IFuture} from "../futures/i-future";
import {ICluster} from "../clusters/i-cluster";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IList} from "../collections/i-list";
import {IInstallerServices} from "./i-installer-services";

export interface IClusterInstaller {
    prepareAndSaveConfiguration(cluster:ICluster):IFuture<IInstallerServerConfiguration>;
    verifyMapRNotInstalled(cluster:ICluster):IFuture<IList<ISSHResult>>;
    services(cluster:ICluster):IFuture<IInstallerServices>;
}