import IRepository from "./i-repository";

export default class YumRepository implements IRepository {

    get type():string {
        return 'yum';
    }

    get host():string {
        //TODO: Allow this to vary based on "phase"
        return 'yum.qa.lab';
    }

    get packageCommand():string {
        return 'yum';
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