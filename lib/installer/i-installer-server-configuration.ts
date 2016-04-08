import IThenable from "../promise/i-thenable";
import IList from "../collections/i-list";

interface IInstallerServerConfiguration {
    enableService(serviceName:string, version:string):IInstallerServerConfiguration;
    disableService(serviceName:string, version:string):IInstallerServerConfiguration;
    setSSHPassword(newValue:string):IInstallerServerConfiguration;
    setClusterAdminPassword(newValue:string):IInstallerServerConfiguration;
    setSSHUsername(newValue:string):IInstallerServerConfiguration;
    setSSHMethod(newValue:string):IInstallerServerConfiguration;
    setLicenseType(newValue:string):IInstallerServerConfiguration;
    setDisks(newValue:IList<string>):IInstallerServerConfiguration;
    setHosts(newValue:IList<string>):IInstallerServerConfiguration;
    setClusterName(newValue:string):IInstallerServerConfiguration;
    save():IThenable<IInstallerServerConfiguration>;
    toJSONString():string;
}

export default IInstallerServerConfiguration;