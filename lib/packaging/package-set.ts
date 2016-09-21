import {IPackageSet} from "./i-package-set";
import {IPackaging} from "./i-packaging";
import {IPromotionLevel} from "./i-promotion-level";
import {ISemanticVersion} from "./i-semantic-version";
import {IList} from "../collections/i-list";
import {IPackage} from "./i-package";
import {IPackageSets} from "./i-package-sets";
import {IPackageSetConfig} from "./i-package-set-config";

export class PackageSet implements IPackageSet {
    constructor(
        private config:IPackageSetConfig,
        private packaging:IPackaging,
        private packageSets:IPackageSets
    ) {}

    get id():string {
        return this.config.id;
    }

    get packages():IList<IPackage> {
        return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(
            this.config.packages,
            this.packageSets
        );
    }

    get version():ISemanticVersion {
        return this.packaging.newSemanticVersion(
            this.config.version
        );
    }

    get promotionLevel():IPromotionLevel {
        return this.packaging.newPromotionLevel(
            this.config.promotionLevel
        );
    }

}