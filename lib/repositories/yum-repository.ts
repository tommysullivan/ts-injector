import IRepository from "./i-repository";
import IList from "../collections/i-list";

export default class YumRepository implements IRepository {

    get host():string {
        return 'yum.qa.lab';
    }

    get packageCommand():string {
        return 'yum';
    }

    get repoConfigDirectory():string {
        return '/etc/yum.repos.d/';
    }

    get patchRepoFileName():string {
        return 'mapr-patch-yum.repo';
    }

    get coreRepoFileName():string {
        return 'mapr-yum.repo';
    }

    get ecosystemRepoFileName():string {
        return 'ecosystem-yum.repo';
    }


    get uninstallCorePackagesCommand():string {
        return `rpm -qa | grep mapr | sed ":a;N;$!ba;s/\\n/ /g" | xargs rpm -e`;
    }

    uninstallPackagesCommand(packageNames:IList<string>) {
        return `${this.packageCommand} remove -y ${packageNames.join(' ')}`;
    }

    get installJavaCommand():string {
        return this.installPackageCommand('java');
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

    //TODO: Deduplicate and enable configurability
    private pathFor(componentFamily:string):string {
        return {
            "mapr-installer": "/installer-master-ui",
            "MapR Core": "/v5.1.0",
            "Ecosystem": "/opensource"
        }[componentFamily];
    }

    //TODO: Deduplicate and enable configurability
    urlFor(componentFamily:string):string {
        return `http://${this.host}${this.pathFor(componentFamily)}`;
    }
}