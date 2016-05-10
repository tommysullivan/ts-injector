import IRepository from "./i-repository";
import IList from "../collections/i-list";

export default class ZypperRepository implements IRepository {

    get host():string {
        return 'yum.qa.lab';
    }

    get packageCommand():string {
        return 'zypper';
    }

    get repoConfigDirectory():string {
        return '/etc/zypp/repos.d/';
    }

    get patchRepoFileName():string {
        return 'mapr-patch-yum.repo';
    }

    get coreRepoFileName():string {
        return 'mapr-zypper.repo';
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
        return 'zypper refresh';
    } 

    get repoListCommand():string {
        return 'zypper repos';
    }

    get packageListCommand():string {
        return 'rpm -qa';
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