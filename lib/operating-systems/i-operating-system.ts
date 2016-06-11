import IPackageManager from "../packaging/i-package-manager";

interface IOperatingSystem {
    name:string;
    version:string;
    packageManager:IPackageManager;
    systemInfoCommand:string;
}

export default IOperatingSystem;