import {IPackageSet} from "./i-package-set";
import {IList} from "../collections/i-list";
import {ISemanticVersion} from "./i-semantic-version";

export interface IPackageSets {
    setWithIdAndVersion(soughtId:string, version:ISemanticVersion):IPackageSet;
    all:IList<IPackageSet>;
}