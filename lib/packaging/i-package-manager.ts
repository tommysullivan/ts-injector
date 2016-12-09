import {IList} from "../collections/i-list";
import {IConfigFileContent} from "./i-config-file-content";

export interface IPackageManager extends IConfigFileContent {
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
    updatePackagesCommand(packageNames:IList<string>):string;
}