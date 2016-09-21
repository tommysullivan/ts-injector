import {IRepositories} from "./i-repositories";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";
import {IRepository} from "./i-repository";
import {IPackaging} from "./i-packaging";
import {IPackageSets} from "./i-package-sets";
import {IPackage} from "./i-package";
import {IRepositoryConfig} from "./i-repository-config";

export class Repositories implements IRepositories {

    constructor(
        private repositoryConfigs:IList<IRepositoryConfig>,
        private packaging:IPackaging,
        private packageSets:IPackageSets
    ) {}

    repositoryAtUrl(url:string):IRepository {
        return this.all.firstWhere(r=>r.url==url);
    }

    get all():IList<IRepository> {
        return this.repositoryConfigs.map(
            repositoryConfig => this.packaging.newRepository(repositoryConfig, this.packageSets)
        );
    }

    repositoryHosting(packageName:string, version:string, promotionLevel:string, operatingSystem:string):IRepository {
        const possibleRepositories = this.all.filter(
            r=>r.packages.hasAtLeastOne(
                (p:IPackage)=>{
                    return p.name == packageName
                        && p.version.matches(version)
                        && p.promotionLevel.name == promotionLevel
                        && p.supportedOperatingSystems.contain(operatingSystem.toLowerCase());
                }
            )
        );
        if(possibleRepositories.length == 0) {
            throw new Error(`specified package not hosted by any repository. ${packageName}`);
        }
        else if(possibleRepositories.hasMany) {
            throw new Error(`specified package hosted by more than one repository. ${packageName}`);
        }
        return possibleRepositories.first;
    }

}