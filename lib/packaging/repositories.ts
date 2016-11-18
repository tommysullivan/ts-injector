import {IRepositories} from "./i-repositories";
import {IList} from "../collections/i-list";
import {IRepository} from "./i-repository";
import {IPackaging} from "./i-packaging";
import {IPackageSets} from "./i-package-sets";
import {IPackage} from "./i-package";
import {IRepositoryConfig} from "./i-repository-config";
import {PackageRepositoryNotFoundException} from "./package-repository-not-found-exception";
import {PackageRepositoryIsAmbiguousException} from "./package-repository-is-ambiguous-exception";

export class Repositories implements IRepositories {

    constructor(
        private repositoryConfigs:IList<IRepositoryConfig>,
        private packaging:IPackaging,
        private packageSets:IPackageSets
    ) {}

    repositoryAtUrl(url:string):IRepository {
        try {
            return this.all.firstWhere(r=>r.url==url);
        }
        catch(e) {
            throw new Error(`Could not find repository at url: ${url}`);
        }
    }

    get all():IList<IRepository> {
        return this.repositoryConfigs.map(
            repositoryConfig => this.packaging.newRepository(repositoryConfig, this.packageSets)
        );
    }

    repositoryHosting(packageName:string, version:string, promotionLevel:string, operatingSystem:string, releaseName:string):IRepository {
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
        const createNewRepositoryError = () => new PackageRepositoryNotFoundException(packageName, version, promotionLevel, operatingSystem, releaseName);
        if(possibleRepositories.length == 0) {
            throw createNewRepositoryError();
        }
        else if(possibleRepositories.hasMany) {
            const preferredRepositories = possibleRepositories.filter(
                r=>r.isPreferredForRelease(releaseName)
            );
            if(preferredRepositories.length != 1) throw new PackageRepositoryIsAmbiguousException(
                createNewRepositoryError(),
                possibleRepositories,
                preferredRepositories
            );
            return preferredRepositories.first;
        }
        else
            return possibleRepositories.first;
    }

}