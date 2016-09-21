import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {IFuture} from "../promise/i-future";
import {IClusterUnderTest} from "../cluster-testing/i-cluster-under-test";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IList} from "../collections/i-list";
import {IInstallerServices} from "./i-installer-services";

export interface IClusterInstaller {
    prepareAndSaveConfiguration(cluster:IClusterUnderTest):IFuture<IInstallerServerConfiguration>;
    verifyMapRNotInstalled(cluster:IClusterUnderTest):IFuture<IList<ISSHResult>>;
    services(cluster:IClusterUnderTest):IFuture<IInstallerServices>;
}