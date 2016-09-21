import {IFuture} from "../promise/i-future";
import {IInstallerServices} from "./i-installer-services";
import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {InstallerProcess} from "./installer-process";

export interface IInstallerRestSession {
    services():IFuture<IInstallerServices>;
    configuration():IFuture<IInstallerServerConfiguration>;
    process():IFuture<InstallerProcess>;
}