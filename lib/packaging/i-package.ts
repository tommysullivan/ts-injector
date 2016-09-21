import {IPromotionLevel} from "./i-promotion-level";
import {ISemanticVersion} from "./i-semantic-version";
import {IList} from "../collections/i-list";

export interface IPackage {
    name:string;
    version:ISemanticVersion;
    promotionLevel:IPromotionLevel;
    supportedOperatingSystems:IList<string>;
    equals(other:IPackage):boolean;
    tags:IList<string>;
}