import IPromotionLevel from "./i-promotion-level";
import ISemanticVersion from "./i-semantic-version";
import IList from "../collections/i-list";

interface IPackage {
    name:string;
    version:ISemanticVersion;
    promotionLevel:IPromotionLevel;
    supportedOperatingSystems:IList<string>;
    equals(other:IPackage):boolean;
    tags:IList<string>;
}
export default IPackage;