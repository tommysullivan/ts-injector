import IRepository from "./i-repository";
import IList from "../collections/i-list";

export default class YumRepository implements IRepository {

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
        return `/etc/yum.repos.d/test-automation-${componentFamily}.repo`;
    }

    get packageCommand():string {
        return 'yum';
    }

    get repoConfigDirectory():string {
        return '/etc/yum.repos.d/';
    }

    get uninstallCorePackagesCommand():string {
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