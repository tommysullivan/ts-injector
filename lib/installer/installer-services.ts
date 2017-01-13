import {IInstallerServices} from "./i-installer-services";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";
import {IRestClient} from "../rest/common/i-rest-client";
import {IInstaller} from "./i-installer";
import {IInstallerService} from "./i-installer-service";

export class InstallerServices implements IInstallerServices {
    constructor(
        private servicesJSON:IJSONObject,
        private installer:IInstaller,
        private authedRestClient:IRestClient
    ) {}

    get serviceList():IList<IInstallerService> {
        return this.servicesJSON.listOfJSONObjectsNamed('resources').map(installerServiceJSON=>{
            return this.installer.newInstallerService(installerServiceJSON, this.authedRestClient)
        });
    }

    serviceMatchingNameAndVersion(serviceName:string, version:string):IInstallerService {
        return this.serviceList.firstWhere(s=>s.name==serviceName && s.version==version);
    }
}