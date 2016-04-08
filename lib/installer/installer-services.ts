import IInstallerServices from "./i-installer-services";
import Collections from "../collections/collections";
import IList from "../collections/i-list";
import InstallerService from "./installer-service";
import Installer from "./installer";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import IJSONObject from "../typed-json/i-json-object";

export default class InstallerServices implements IInstallerServices {
    private servicesJSON:IJSONObject;
    private collections:Collections;
    private installer:Installer;
    private authedRestClient:RestClientAsPromised;

    constructor(servicesJSON:IJSONObject, collections:Collections, installer:Installer, authedRestClient:RestClientAsPromised) {
        this.servicesJSON = servicesJSON;
        this.collections = collections;
        this.installer = installer;
        this.authedRestClient = authedRestClient;
    }

    get serviceList():IList<InstallerService> {
        return this.servicesJSON.listOfJSONObjectsNamed('resources').map(installerServiceJSON=>{
            return this.installer.newInstallerService(installerServiceJSON, this.authedRestClient)
        });
    }

    serviceMatchingNameAndVersion(serviceName:string, version:string):InstallerService {
        return this.serviceList.firstWhere(s=>s.name==serviceName && s.version==version);
    }
}