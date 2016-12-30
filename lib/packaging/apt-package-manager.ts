import {IList} from "../collections/i-list";
import {IPackageManager} from "./i-package-manager";
import {IRepository} from "./i-repository";

export class AptPackageManager implements IPackageManager {

    clientConfigurationFileContentFor(repository:IRepository, descriptiveName:string, tagName:string):string {
        if (tagName == 'core')
            return `deb ${repository.url} mapr optional`;
        else
            return `deb ${repository.url} binary trusty`;
    }

    clientConfigurationFileLocationFor(packageName:string):string {
        return `/etc/apt/sources.list.d/test-automation-${packageName}.list`;
    }

    installPackagesCommand(packageNames:IList<string>):string {
        return `${this.packageCommand} install -y ${packageNames.join(' ')} --allow-unauthenticated`;
    }

    updatePackagesCommand(packageNames:IList<string>):string {
        return `${this.packageCommand} install -y ${packageNames.join(' ')} --allow-unauthenticated`;
    }

    get uninstallAllPackagesWithMapRInTheName():string {
        return `dpkg -l | grep mapr | cut -d ' ' -f 3 | sed ":a;N;s/\\n/ /g" | tr ' ' '\\n' | xargs apt-get purge -y`;
    }

    uninstallPackagesCommand(packageNames:IList<string>) {
        return `${this.packageCommand} purge -y ${packageNames.join(' ')}`;
    }

    get installJavaCommand():string {
        return this.installPackageCommand('openjdk-7-jdk');
    }

    installPackageCommand(packageName:string):string {
        return `${this.packageCommand} install -y ${packageName} --allow-unauthenticated`;
    }

    get packageUpdateCommand():string {
        return 'apt-get update';
    }

    get packageCommand():string {
        return 'apt-get';
    }

    get repoListCommand():string {
        return 'apt-cache policy';
    }

    get packageListCommand():string {
        return 'dpkg -l';
    }
}