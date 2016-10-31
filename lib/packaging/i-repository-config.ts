import {IPackageConfig} from "./i-package-config";
import {IPackageSetRefConfig} from "./i-package-set-ref-config";

export interface IRepositoryConfig {
    url:string;
    packages:Array<IPackageConfig | IPackageSetRefConfig>;
    releases?:Array<string>;
}