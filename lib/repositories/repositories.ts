import IRepository from "./i-repository";
import YumRepository from "./yum-repository";
import ZypperRepository from "./zypper-repository";
import AptRepository from "./apt-repository";
import IRepositories from "./i-repositories";
import IRepositoryUrlProvider from "./i-repository-url-provider";
import RepositoryUrlProvider from "./repository-url-provider";
import ITypedJSON from "../typed-json/i-typed-json";

export default class Repositories implements IRepositories {
    private typedJson:ITypedJSON;

    constructor(typedJson:ITypedJSON) {
        this.typedJson = typedJson;
    }

    newRepositoryForOS(operatingSystemName:string):IRepository {
        switch(operatingSystemName.toLowerCase()) {
            case 'centos': case 'redhat': return this.newYumRepository();
            case 'ubuntu': return this.newAptRepository();
            case 'suse': return this.newZypperRepository();
            default: throw new Error(`cannot create repository for OS "${operatingSystemName}`);
        }
    }

    newYumRepository():IRepository {
        return new YumRepository();
    }

    newZypperRepository():IRepository {
        return new ZypperRepository();
    }

    newAptRepository():IRepository {
        return new AptRepository();
    }

    newRepositoryUrlProvider():IRepositoryUrlProvider {
        return new RepositoryUrlProvider(this.typedJson);
    }
}