import {IPackageSetRefConfig} from "../packaging/i-package-set-ref-config";
import {IPackageConfig} from "../packaging/i-package-config";

export interface IPhaseConfig {
    name:string;
    packages:Array<IPackageConfig | IPackageSetRefConfig>;
}