import IRepository from "./i-repository";
import IList from "../collections/i-list";

export default class AptRepository implements IRepository {

    configFileContentFor(componentFamily:string, repoUrl:string):string {
        return `deb ${repoUrl} binary/`
    }

    configFileLocationFor(componentFamily:string):string {
        return `/etc/apt/sources.list.d/test-automation-${componentFamily}.list`;
    }

    installPackagesCommand(packageNames:IList<string>):string {
        return `${this.packageCommand} install -y ${packageNames.join(' ')} --allow-unauthenticated`;
    }

    get uninstallCorePackagesCommand():string {
        return `dpkg -l | grep mapr | cut -d ' ' -f 3 | sed ':a;N;$!ba;s/\\n/ /g' | xargs apt-get purge -y`;
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