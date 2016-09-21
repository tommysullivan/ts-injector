import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IPackageSetConfig} from "./i-package-set-config";
import {IRepositoryConfig} from "./i-repository-config";

export interface IPackagingConfig extends IJSONSerializable {
    packageSets:Array<IPackageSetConfig>;
    repositories:Array<IRepositoryConfig>;
}