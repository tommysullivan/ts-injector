import {IList} from "../collections/i-list";
import {IPackage} from "./i-package";
import {ISemanticVersion} from "./i-semantic-version";

export interface IPackageSet {
    id:string;
    version:ISemanticVersion;
    packages:IList<IPackage>;
}