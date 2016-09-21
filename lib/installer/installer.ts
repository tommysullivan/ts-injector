import {IInstallerRestSession} from "./i-installer-rest-session";
import {InstallerRestClient} from "./installer-rest-client";
import {InstallerServerConfiguration} from "./installer-server-configuration";
import {InstallerRestSession} from "./installer-rest-session";
import {InstallerProcess} from "./installer-process";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {InstallerServices} from "./installer-services";
import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IJSONObject} from "../typed-json/i-json-object";
import {InstallerService} from "./installer-service";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IRest} from "../rest/i-rest";
import {IInstaller} from "./i-installer";
import {IInstallerRestClient} from "./i-installer-rest-client";
import {IInstallerProcess} from "./i-installer-process";
import {IInstallerServices} from "./i-installer-services";
import {RestClientAsPromised} from "../rest/rest-client-as-promised";
import {IInstallerService} from "./i-installer-service";
import {IInstallerClientConfiguration} from "./i-installer-client-configuration";

export class Installer implements IInstaller {
    constructor(
        private installerClientConfiguration:IInstallerClientConfiguration,
        private rest:IRest,
        private promiseFactory:IPromiseFactory,
        private typedJSON:ITypedJSON
    ) {}

    newInstallerClient():IInstallerRestClient {
        return new InstallerRestClient(this, this.installerClientConfiguration, this.rest, this.typedJSON);
    }

    newInstallerRestSession(authedRestClient:IRestClientAsPromised, apiJSON:IJSONObject):IInstallerRestSession {
        return new InstallerRestSession(authedRestClient, this, this.installerClientConfiguration, apiJSON, this.typedJSON);
    }

    newInstallerServerConfiguration(serverConfigJSON:IJSONObject, authedRestClient:IRestClientAsPromised, serverConfigResourceURL:string):IInstallerServerConfiguration {
        return new InstallerServerConfiguration(this, serverConfigJSON, authedRestClient, serverConfigResourceURL);
    }

    newInstallerProcess(processJSON:IJSONObject, authedRestClient:IRestClientAsPromised, processResourceURL:string):IInstallerProcess {
        return new InstallerProcess(authedRestClient, processJSON, this.installerClientConfiguration, processResourceURL, this.promiseFactory);
    }

    newInstallerServices(servicesJSON:IJSONObject, authedRestClient:IRestClientAsPromised):IInstallerServices {
        return new InstallerServices(servicesJSON, this, authedRestClient);
    }

    newInstallerService(serviceJSON:IJSONObject, authedRestClient:RestClientAsPromised):IInstallerService {
        return new InstallerService(
            serviceJSON,
            authedRestClient,
            this.typedJSON
        );
    }
}