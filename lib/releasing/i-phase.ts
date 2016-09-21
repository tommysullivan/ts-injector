import {IList} from "../collections/i-list";
import {IPackage} from "../packaging/i-package";

export interface IPhase {
    name:string;
    packagesForOperatingSystem(operatingSystemName:string):IList<IPackage>;
    packages:IList<IPackage>;
}