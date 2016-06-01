import IRepository from "./i-repository";
import IList from "../collections/i-list";

export default class ZypperRepository implements IRepository {

    configFileContentFor(componentFamily:string, repoUrl:string):string {
        return [
            `[${componentFamily}]`,
            `name = ${componentFamily}`,
            `enabled = 1`,
            `baseurl = ${repoUrl}`,
            `protected = 1`,
            `gpgcheck = 0`
        ].join("\n");
    }

    configFileLocationFor(componentFamily:string):string {
        return `/etc/zypp/repos.d/test-automation-${componentFamily}.repo`;
    }

    get packageCommand():string {
        return 'zypper';
    }

    get repoConfigDirectory():string {
        return '/etc/zypp/repos.d/';
    }

    get uninstallCorePackagesCommand():string {
        return `rpm -qa | grep mapr | sed ":a;N;$!ba;s/\\n/ /g" | xargs rpm -e`;
    }

    uninstallPackagesCommand(packageNames:IList<string>) {
        return `${this.packageCommand} remove -y ${packageNames.join(' ')}`;
    }

    get installJavaCommand():string {
        return this.installPackageCommand('java-1_7_0-openjdk');
    }

    installPackagesCommand(packageNames:IList<string>):string {
        return `${this.packageCommand} install -y ${packageNames.join(' ')}`;
    }

    installPackageCommand(packageName:string):string {
        return `${this.packageCommand} install -y ${packageName}`;
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