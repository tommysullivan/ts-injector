import IPackage from "./i-package";
import ISemanticVersion from "./i-semantic-version";
import IPromotionLevel from "./i-promotion-level";
import IList from "../collections/i-list";
import PackageComparer from "./package-comparer";

export default class PackageFromLiterals implements IPackage {
    constructor(
        public name:string,
        public version:ISemanticVersion,
        public promotionLevel:IPromotionLevel,
        public supportedOperatingSystems:IList<string>,
        private packageComparer:PackageComparer,
        public tags:IList<string>
    ) {}

    equals(other:IPackage):boolean {
        return this.packageComparer.equals(this, other);
    }
}