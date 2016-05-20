import IList from "../collections/i-list";

interface IRepository {
    host:string;
    packageCommand:string;
    repoConfigDirectory:string;
    patchRepoFileName:string;
    coreRepoFileName:string;
    ecosystemRepoFileName:string;
    spyglassRepoFileName:string;
    uninstallCorePackagesCommand:string;
    uninstallPackagesCommand(packageNames:IList<string>);
    installJavaCommand:string;
    installPackagesCommand(packageNames:IList<string>):string;
    installPackageCommand(packageName:string):string;
    repoListCommand:string;
    packageListCommand:string;
    packageUpdateCommand:string;
    urlFor(componentFamily:string):string;
}

export default IRepository;