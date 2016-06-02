import IList from "../collections/i-list";

interface IRepository {
    packageCommand:string;
    uninstallCorePackagesCommand:string;
    installJavaCommand:string;
    repoListCommand:string;
    packageListCommand:string;
    packageUpdateCommand:string;
    uninstallPackagesCommand(packageNames:IList<string>);
    installPackagesCommand(packageNames:IList<string>):string;
    installPackageCommand(packageName:string):string;
    configFileContentFor(componentFamily:string, repoUrl:string):string;
    configFileLocationFor(componentFamily:string):string;
}

export default IRepository;