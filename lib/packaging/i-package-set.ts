import IList from "../collections/i-list";
import IPackage from "./i-package";
import ISemanticVersion from "./i-semantic-version";

interface IPackageSet {
    id:string;
    version:ISemanticVersion;
    packages:IList<IPackage>;
}
export default IPackageSet;