import {IPackageSet} from "./i-package-set";
import {IPackaging} from "./i-packaging";
import {IList} from "../collections/i-list";
import {IPackage} from "./i-package";
import {IPackageSets} from "./i-package-sets";
import {ISemanticVersion} from "./i-semantic-version";
import {IPackageSetRefConfig} from "./i-package-set-ref-config";
import {ICollections} from "../collections/i-collections";

export class PackageSetReference implements IPackageSet {
    constructor(
        private config:IPackageSetRefConfig,
        private packaging:IPackaging,
        private packageSets:IPackageSets,
        private collections:ICollections
    ) {}

    private get referredPackageSetId():string {
        return this.config.packageSetRef;
    }

    get id():string {
        return `reference-to-${this.referredPackageSetId}`;
    }

    get version():ISemanticVersion {
        return this.packaging.newSemanticVersion(this.config.version);
    }

    get packages():IList<IPackage> {
        return this.packageSets.setWithIdAndVersion(this.referredPackageSetId, this.version).packages.map(
            originalPackage => this.packaging.newPackageWithOverrides(
                originalPackage, 
                this.config.operatingSystems
                    ? this.collections.newList<string>(this.config.operatingSystems)
                    : null,
                this.config.promotionLevel
                    ? this.packaging.newPromotionLevel(this.config.promotionLevel)
                    : null,
                this.config.tags
                    ? this.collections.newList<string>(this.config.tags)
                    : null
            )
        );
    }
}