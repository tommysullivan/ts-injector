import IList from "../collections/i-list";
import IPackage from "../packaging/i-package";

interface IPhase {
    name:string;
    packagesForOperatingSystem(operatingSystemName:string):IList<IPackage>;
    packages:IList<IPackage>;
}

export default IPhase;