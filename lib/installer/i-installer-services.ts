import {IInstallerService} from "./i-installer-service";
import {IList} from "../collections/i-list";

export interface IInstallerServices {
    serviceMatchingNameAndVersion(serviceName:string, version:string):IInstallerService;
    serviceList:IList<IInstallerService>;
}