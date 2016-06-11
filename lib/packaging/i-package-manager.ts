import IList from "../collections/i-list";
import IRepository from "./i-repository";
import IConfigFileContent from "./i-config-file-content";

interface IPackageManager extends IConfigFileContent {
    packageCommand:string;
    uninstallAllPackagesWithMapRInTheName:string;
    installJavaCommand:string;
    repoListCommand:string;
    packageListCommand:string;
    packageUpdateCommand:string;
    uninstallPackagesCommand(packageNames:IList<string>);
    installPackagesCommand(packageNames:IList<string>):string;
    installPackageCommand(packageName:string):string;
    clientConfigurationFileLocationFor(packageName:string):string;
}

export default IPackageManager;