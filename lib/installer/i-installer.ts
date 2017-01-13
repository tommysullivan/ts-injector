import {IInstallerRestClient} from "./i-installer-rest-client";
import {IInstallerRestSession} from "./i-installer-rest-session";
import {IJSONObject} from "../typed-json/i-json-object";
import {IRestClient} from "../rest/common/i-rest-client";
import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {IInstallerProcess} from "./i-installer-process";
import {IInstallerServices} from "./i-installer-services";
import {IInstallerService} from "./i-installer-service";

export interface IInstaller {
    newInstallerClient():IInstallerRestClient;
    newInstallerRestSession(authedRestClient:IRestClient, apiJSON:IJSONObject):IInstallerRestSession;
    newInstallerServerConfiguration(serverConfigJSON:IJSONObject, authedRestClient:IRestClient, serverConfigResourceURL:string):IInstallerServerConfiguration;
    newInstallerProcess(processJSON:IJSONObject, authedRestClient:IRestClient, processResourceURL:string):IInstallerProcess;
    newInstallerServices(servicesJSON:IJSONObject, authedRestClient:IRestClient):IInstallerServices;
    newInstallerService(serviceJSON:IJSONObject, authedRestClient:IRestClient):IInstallerService;
}