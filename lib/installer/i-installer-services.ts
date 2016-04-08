import InstallerService from "./installer-service";

interface IInstallerServices {
    serviceMatchingNameAndVersion(serviceName:string, version:string):InstallerService;
}

export default IInstallerServices;