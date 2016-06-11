import IList from "../collections/i-list";
import IPackageManager from "./i-package-manager";
import IRepository from "./i-repository";
import IConfigFileContent from "./i-config-file-content";

export default class YumPackageManager implements IPackageManager {

    private configFileContent:IConfigFileContent;

    constructor(configFileContent:IConfigFileContent) {
        this.configFileContent = configFileContent;
    }

    clientConfigurationFileContentFor(repository:IRepository, descriptiveName:string):string {
        return this.configFileContent.clientConfigurationFileContentFor(repository, descriptiveName);
    }

    clientConfigurationFileLocationFor(packageName:string):string {
        return `/etc/yum.repos.d/test-automation-${packageName}.repo`;
    }

    get packageCommand():string {
        return 'yum';
    }

    get repoConfigDirectory():string {
        return '/etc/yum.repos.d/';
    }

    get uninstallAllPackagesWithMapRInTheName():string {
        return `rpm -qa | grep mapr | sed ":a;N;$!ba;s/\\n/ /g" | xargs rpm -e`;
    }

    uninstallPackagesCommand(packageNames:IList<string>) {
        return `${this.packageCommand} remove -y ${packageNames.join(' ')}`;
    }

    get installJavaCommand():string {
        return this.installPackageCommand('java-1.7.0-openjdk');
    }

    installPackagesCommand(packageNames:IList<string>):string {
        return `${this.packageCommand} install -y ${packageNames.join(' ')}`;
    }

    installPackageCommand(packageName:string):string {
        return `${this.packageCommand} install -y ${packageName}`;
    }

    get packageUpdateCommand():string {
        return 'yum clean all';
    } 

    get repoListCommand():string {
        return 'yum repolist all';
    }

    get packageListCommand():string {
        return 'yum list installed';
    }
}