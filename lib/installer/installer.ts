import IInstallerRestSession from "./i-installer-rest-session";
import InstallerRestClient from "./installer-rest-client";
import Rest from "../rest/rest";
import InstallerServerConfiguration from "./installer-server-configuration";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import InstallerClientConfiguration from "./installer-client-configuration";
import InstallerRestSession from "./installer-rest-session";
import InstallerProcess from "./installer-process";
import IPromiseFactory from "../promise/i-promise-factory";
import InstallerServices from "./installer-services";
import Collections from "../collections/collections";
import IInstallerServerConfiguration from "./i-installer-server-configuration";
import ITypedJSON from "../typed-json/i-typed-json";
import IJSONObject from "../typed-json/i-json-object";
import InstallerService from "./installer-service";

export default class Installer {
    private clientConfiguration:InstallerClientConfiguration;
    private rest:Rest;
    private promiseFactory:IPromiseFactory;
    private collections:Collections;
    private typedJSON:ITypedJSON;

    constructor(clientConfiguration:InstallerClientConfiguration, rest:Rest, promiseFactory:IPromiseFactory, collections:Collections, typedJSON:ITypedJSON) {
        this.clientConfiguration = clientConfiguration;
        this.rest = rest;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }

    newInstallerClient():InstallerRestClient {
        return new InstallerRestClient(this, this.clientConfiguration, this.rest, this.typedJSON);
    }

    newInstallerRestSession(authedRestClient:RestClientAsPromised, apiJSON:IJSONObject):IInstallerRestSession {
        return new InstallerRestSession(authedRestClient, this, this.clientConfiguration, apiJSON, this.typedJSON);
    }

    newInstallerServerConfiguration(serverConfigJSON:IJSONObject, authedRestClient:RestClientAsPromised, serverConfigResourceURL:string):IInstallerServerConfiguration {
        return new InstallerServerConfiguration(this, serverConfigJSON, authedRestClient, serverConfigResourceURL);
    }

    newInstallerProcess(processJSON:IJSONObject, authedRestClient:RestClientAsPromised, processResourceURL:string):InstallerProcess {
        return new InstallerProcess(authedRestClient, processJSON, this.clientConfiguration, processResourceURL, this.promiseFactory);
    }

    newInstallerServices(servicesJSON:IJSONObject, authedRestClient:RestClientAsPromised) {
        return new InstallerServices(servicesJSON, this.collections, this, authedRestClient);
    }

    newInstallerService(serviceJSON:IJSONObject, authedRestClient:RestClientAsPromised):InstallerService {
        return new InstallerService(
            serviceJSON,
            authedRestClient,
            this.typedJSON
        );
    }
}