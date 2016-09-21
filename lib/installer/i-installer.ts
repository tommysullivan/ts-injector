import {IInstallerRestClient} from "./i-installer-rest-client";
import {IInstallerRestSession} from "./i-installer-rest-session";
import {IJSONObject} from "../typed-json/i-json-object";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {IInstallerProcess} from "./i-installer-process";
import {IInstallerServices} from "./i-installer-services";
import {IInstallerService} from "./i-installer-service";

export interface IInstaller {
    newInstallerClient():IInstallerRestClient;
    newInstallerRestSession(authedRestClient:IRestClientAsPromised, apiJSON:IJSONObject):IInstallerRestSession;
    newInstallerServerConfiguration(serverConfigJSON:IJSONObject, authedRestClient:IRestClientAsPromised, serverConfigResourceURL:string):IInstallerServerConfiguration;
    newInstallerProcess(processJSON:IJSONObject, authedRestClient:IRestClientAsPromised, processResourceURL:string):IInstallerProcess;
    newInstallerServices(servicesJSON:IJSONObject, authedRestClient:IRestClientAsPromised):IInstallerServices;
    newInstallerService(serviceJSON:IJSONObject, authedRestClient:IRestClientAsPromised):IInstallerService;
}