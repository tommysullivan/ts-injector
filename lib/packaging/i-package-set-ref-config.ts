export interface IPackageSetRefConfig {
    packageSetRef:string;
    version:string;
    operatingSystems?:Array<string>;
    promotionLevel?:string;
    tags?:Array<string>;
}