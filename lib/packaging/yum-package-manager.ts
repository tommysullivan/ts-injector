import {IList} from "../collections/i-list";
import {IPackageManager} from "./i-package-manager";
import {IRepository} from "./i-repository";
import {IConfigFileContent} from "./i-config-file-content";

export class YumPackageManager implements IPackageManager {

    private configFileContent:IConfigFileContent;

    constructor(configFileContent:IConfigFileContent) {
        this.configFileContent = configFileContent;
    }

    clientConfigurationFileContentFor(repository:IRepository, descriptiveName:string, tagName:string):string {
        return this.configFileContent.clientConfigurationFileContentFor(repository, descriptiveName, tagName);
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
        return `rpm -qa | grep mapr && rpm -qa | grep mapr | sed ":a;N;s/\\n/ /g" | tr ' ' '\\n' | xargs rpm -e`;
    }

    uninstallPackagesCommand(packageNames:IList<string>) {
        return `${this.packageCommand} remove -y ${packageNames.join(' ')}`;
    }

    get installJavaCommand():string {
        return this.installPackageCommand('java-1.7.0-openjdk-devel');
    }

    installPackagesCommand(packageNames:IList<string>):string {
        return `${this.packageCommand} install -y ${packageNames.join(' ')}`;
    }

    updatePackagesCommand(packageNames:IList<string>):string {
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