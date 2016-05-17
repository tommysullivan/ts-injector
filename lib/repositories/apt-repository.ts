import IRepository from "./i-repository";
import IList from "../collections/i-list";
import ICollections from "../collections/i-collections";

export default class AptRepository implements IRepository {

    private collections:ICollections;

    constructor(collections:ICollections) {
        this.collections = collections;
    }

    get repoConfigDirectory():string {
        return '/etc/apt/sources.list.d/';

    }

    get patchRepoFileName():string {
        return 'mapr-patch-apt-get.list';
    }

    get coreRepoFileName():string {
        return 'mapr-apt-get.list';
    }

    get ecosystemRepoFileName():string {
        return 'ecosystem-apt-get.list';
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

    get host():string {
        return 'apt.qa.lab';
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