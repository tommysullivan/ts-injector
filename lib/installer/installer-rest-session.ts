import {Installer} from "./installer";
import {IFuture} from "../promise/i-future";
import {IInstallerRestSession} from "./i-installer-rest-session";
import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IInstallerServices} from "./i-installer-services";
import {InstallerProcess} from "./installer-process";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IInstallerClientConfiguration} from "./i-installer-client-configuration";

export class InstallerRestSession implements IInstallerRestSession {

    constructor(
        private authedRestClient:IRestClientAsPromised,
        private installer:Installer,
        private clientConfiguration:IInstallerClientConfiguration,
        private installerAPIJSON:IJSONObject,
        private typedJSON:ITypedJSON
    ) {}

    configuration():IFuture<IInstallerServerConfiguration> {
        return this.authedRestClient.get(this.serverConfigResourceURL)
            .then(response => this.installer.newInstallerServerConfiguration(
                this.typedJSON.newJSONObject(response.jsonBody),
                this.authedRestClient,
                this.serverConfigResourceURL
            ));
    }

    private linkNamed(name:string) {
        return this.installerAPIJSON.dictionaryNamed<string>('links').getOrThrow(name);
    }

    get serverConfigResourceURL():string {
        return this.linkNamed('config');
    }
    
    services():IFuture<IInstallerServices> {
        return this.authedRestClient.get(this.servicesResourceURL)
            .then(response => this.installer.newInstallerServices(
                this.typedJSON.newJSONObject(response.jsonBody),
                this.authedRestClient)
            );
    }

    get servicesResourceURL():string {
        return this.linkNamed('services');
    }

    process():IFuture<InstallerProcess> {
        return this.authedRestClient.get(this.processResourceURL)
            .then(response=> this.installer.newInstallerProcess(
                this.typedJSON.newJSONObject(response.jsonBody),
                this.authedRestClient,
                this.processResourceURL
            ));
    }

    get processResourceURL():string {
        return this.linkNamed('process');
    }
}