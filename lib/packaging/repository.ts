import {IRepository} from "./i-repository";
import {IPackaging} from "./i-packaging";
import {IPackageSets} from "./i-package-sets";
import {IList} from "../collections/i-list";
import {IPackage} from "./i-package";
import {IRepositoryConfig} from "./i-repository-config";

export class Repository implements IRepository {

    constructor(
        private repositoryConfig:IRepositoryConfig,
        private packaging:IPackaging,
        private packageSets:IPackageSets
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
}