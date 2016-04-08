import RestClientAsPromised from "../rest/rest-client-as-promised";
import Installer from "./installer";
import InstallerClientConfiguration from "./installer-client-configuration";
import IThenable from "../promise/i-thenable";
import IInstallerRestSession from "./i-installer-rest-session";
import IInstallerServerConfiguration from "./i-installer-server-configuration";
import IJSONObject from "../typed-json/i-json-object";
import ITypedJSON from "../typed-json/i-typed-json";
import IInstallerServices from "./i-installer-services";
import InstallerProcess from "./installer-process";

export default class InstallerRestSession implements IInstallerRestSession {

    private authedRestClient:RestClientAsPromised;
    private installer:Installer;
    private clientConfiguration:InstallerClientConfiguration;
    private installerAPIJSON:IJSONObject;
    private typedJSON:ITypedJSON;

    constructor(authedRestClient:RestClientAsPromised, installer:Installer, clientConfiguration:InstallerClientConfiguration, installerAPIJSON:IJSONObject, typedJSON:ITypedJSON) {
        this.authedRestClient = authedRestClient;
        this.installer = installer;
        this.clientConfiguration = clientConfiguration;
        this.installerAPIJSON = installerAPIJSON;
        this.typedJSON = typedJSON;
    }

    configuration():IThenable<IInstallerServerConfiguration> {
        return this.authedRestClient.get(this.serverConfigResourceURL)
            .then(response => this.installer.newInstallerServerConfiguration(
                this.typedJSON.newJSONObject(response.jsonBody()),
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
    
    services():IThenable<IInstallerServices> {
        return this.authedRestClient.get(this.servicesResourceURL)
            .then(response => this.installer.newInstallerServices(
                this.typedJSON.newJSONObject(response.jsonBody()),
                this.authedRestClient)
            );
    }

    get servicesResourceURL():string {
        return this.linkNamed('services');
    }

    process():IThenable<InstallerProcess> {
        return this.authedRestClient.get(this.processResourceURL)
            .then(response=> this.installer.newInstallerProcess(
                this.typedJSON.newJSONObject(response.jsonBody()),
                this.authedRestClient,
                this.processResourceURL
            ));
    }

    get processResourceURL():string {
        return this.linkNamed('process');
    }
}