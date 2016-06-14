import IRepositories from "./i-repositories";
import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";
import IRepository from "./i-repository";
import IPackaging from "./i-packaging";
import IPackageSets from "./i-package-sets";
import IPackage from "./i-package";

export default class Repositories implements IRepositories {

    private repositoryJSONArray:IList<IJSONObject>;
    private packaging:IPackaging;
    private packageSets:IPackageSets;

    constructor(repositoryJSONArray:IList<IJSONObject>, packaging:IPackaging, packageSets:IPackageSets) {
        this.repositoryJSONArray = repositoryJSONArray;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }

    repositoryAtUrl(url:string):IRepository {
        return this.all.firstWhere(r=>r.url==url);
    }

    get all():IList<IRepository> {
        return this.repositoryJSONArray.map(
            repositoryJSON => this.packaging.newRepository(repositoryJSON, this.packageSets)
        );
    }

    repositoryHosting(packageName:string, version:string, promotionLevel:string, operatingSystem:string):IRepository {
        var possibleRepositories = this.all.filter(
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
        return possibleRepositories.first();
    }

}