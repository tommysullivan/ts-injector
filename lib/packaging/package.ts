import {IPackage} from "./i-package";
import {IPackaging} from "./i-packaging";
import {ISemanticVersion} from "./i-semantic-version";
import {IPromotionLevel} from "./i-promotion-level";
import {IList} from "../collections/i-list";
import {PackageComparer} from "./package-comparer";
import {IPackageConfig} from "./i-package-config";
import {ICollections} from "../collections/i-collections";

export class Package implements IPackage {
    constructor(
        private packageConfig:IPackageConfig,
        private packaging:IPackaging,
        private packageComparer:PackageComparer,
        private collections:ICollections
    ) {}

    get name():string {
        return this.packageConfig.name
            ? this.packageConfig.name
            : this.packageConfig.package;
    }

    get version():ISemanticVersion {
        return this.packaging.newSemanticVersion(this.packageConfig.version);
    }

    get promotionLevel():IPromotionLevel {
        return this.packaging.newPromotionLevel(
            this.packageConfig.promotionLevel
        );
    }

    get supportedOperatingSystems():IList<string> {
        return this.collections.newList<string>(
            this.packageConfig.operatingSystems
        );
    }

    equals(other:IPackage):boolean {
        return this.packageComparer.equals(this, other);
    }

    get tags():IList<string> {
        return this.collections.newList(
            this.packageConfig.tags || []
        );
    }
}