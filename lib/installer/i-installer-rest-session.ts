import IThenable from "../promise/i-thenable";
import IInstallerServices from "./i-installer-services";
import IInstallerServerConfiguration from "./i-installer-server-configuration";
import InstallerProcess from "./installer-process";

interface IInstallerRestSession {
    services():IThenable<IInstallerServices>;
    configuration():IThenable<IInstallerServerConfiguration>;
    process():IThenable<InstallerProcess>;
}

export default IInstallerRestSession;