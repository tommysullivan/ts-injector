import {IPackageConfig} from "./i-package-config";
import {IPackageSetRefConfig} from "./i-package-set-ref-config";

export interface IPackageSetConfig {
    id:string;
    promotionLevel:string;
    version:string;
    packages:Array<IPackageConfig | IPackageSetRefConfig>;
}