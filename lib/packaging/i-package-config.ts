import {PromotionLevels} from "./promotion-levels";

export interface IPackageConfig {
    package?:string;
    name?:string;
    version:string;
    promotionLevel:PromotionLevels;
    operatingSystems:Array<string>;
    tags?:Array<string>;
}