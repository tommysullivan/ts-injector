import IRepository from "./i-repository";

export default class AptRepository implements IRepository {

    constructor() {
    }

    get type():string {
        return 'apt-get';
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