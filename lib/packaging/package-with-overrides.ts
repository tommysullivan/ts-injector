import {IPackage} from "./i-package";
import {IList} from "../collections/i-list";
import {ISemanticVersion} from "./i-semantic-version";
import {IPromotionLevel} from "./i-promotion-level";
import {PackageComparer} from "./package-comparer";
import {IRepository} from "./i-repository";

export class PackageWithOverrides implements IPackage {

    constructor(
        private originalPackage:IPackage,
        private operatingSystemsOverride:IList<string>,
        private promotionLevelOverride:IPromotionLevel,
        private packageComparer:PackageComparer,
        private tagsOverride:IList<string>
    ) {}

    get name():string { return this.originalPackage.name; }
    get version():ISemanticVersion { return this.originalPackage.version; }

    get promotionLevel():IPromotionLevel {
        return this.promotionLevelOverride
            ? this.promotionLevelOverride
            : this.originalPackage.promotionLevel;
    }

    get supportedOperatingSystems():IList<string> {
        return this.operatingSystemsOverride
            ? this.operatingSystemsOverride
            : this.originalPackage.supportedOperatingSystems;
    }

    get tags():IList<string> {
        return this.tagsOverride
            ? this.tagsOverride
            : this.originalPackage.tags;
    }

    equals(other:IPackage):boolean {
        return this.packageComparer.equals(this, other);
    }
}