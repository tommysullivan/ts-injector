export interface IPromotionLevel {
    name:string;
    equals(other:IPromotionLevel):boolean;
}