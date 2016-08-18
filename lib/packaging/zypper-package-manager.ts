import IList from "../collections/i-list";
import IPackageManager from "./i-package-manager";
import IRepository from "./i-repository";
import IConfigFileContent from "./i-config-file-content";

export default class ZypperPackageManager implements IPackageManager {

    private configFileContent:IConfigFileContent;

    constructor(configFileContent:IConfigFileContent) {
        this.configFileContent = configFileContent;
    }

    clientConfigurationFileContentFor(repository:IRepository, descriptiveName:string, tagName:string):string {
        return this.configFileContent.clientConfigurationFileContentFor(repository, descriptiveName, tagName);
    }

    clientConfigurationFileLocationFor(packageName:string):string {
        return `/etc/zypp/repos.d/test-automation-${packageName}.repo`;
    }

    get packageCommand():string {
        return 'zypper';
    }

    get repoConfigDirectory():string {
        return '/etc/zypp/repos.d/';
    }

    get uninstallAllPackagesWithMapRInTheName():string {
        return `rpm -qa | grep mapr | sed ":a;N;$!ba;s/\\n/ /g" | xargs rpm -e`;
    }

    uninstallPackagesCommand(packageNames:IList<string>) {
        return `${this.packageCommand} remove -y ${packageNames.join(' ')}`;
    }

    get installJavaCommand():string {
        return this.installPackageCommand('java-1_7_0-openjdk-devel');
    }

    installPackagesCommand(packageNames:IList<string>):string {
        return `${this.packageCommand} --non-interactive install -y ${packageNames.join(' ')}`;
    }

    installPackageCommand(packageName:string):string {
        return `${this.packageCommand} --non-interactive install -y ${packageName}`;
    }

    get packageUpdateCommand():string {
        return 'zypper refresh';
    } 

    get repoListCommand():string {
        return 'zypper repos';
    }

    get packageListCommand():string {
        return 'rpm -qa';
    }
}