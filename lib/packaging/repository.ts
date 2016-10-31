import {IRepository} from "./i-repository";
import {IPackaging} from "./i-packaging";
import {IPackageSets} from "./i-package-sets";
import {IList} from "../collections/i-list";
import {IPackage} from "./i-package";
import {IRepositoryConfig} from "./i-repository-config";
import {ICollections} from "../collections/i-collections";

export class Repository implements IRepository {

    constructor(
        private repositoryConfig:IRepositoryConfig,
        private packaging:IPackaging,
        private packageSets:IPackageSets,
        private collections:ICollections
    ) {}

    get url():string {
        return this.repositoryConfig.url;
    }

    get packages():IList<IPackage> {
        return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(
            this.repositoryConfig.packages,
            this.packageSets
        );
    }

    isPreferredForRelease(releaseName:string):boolean {
        return this.collections.newList(
            this.repositoryConfig.releases
        ).hasAtLeastOne(r=>r==releaseName);
    }

    equals(other:IRepository):boolean {
        return other.url == this.url;
    }
}