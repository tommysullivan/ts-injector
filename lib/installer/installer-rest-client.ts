import Rest from "../rest/rest";
import IInstallerRestSession from "./i-installer-rest-session";
import Installer from "./installer";
import InstallerClientConfiguration from "./installer-client-configuration";
import IThenable from "../promise/i-thenable";
import ITypedJSON from "../typed-json/i-typed-json";

export default class InstallerRestClient {

    private installer:Installer;
    private configuration:InstallerClientConfiguration;
    private rest:Rest;
    private typedJSON:ITypedJSON;

    constructor(installer:Installer, configuration:InstallerClientConfiguration, rest:Rest, typedJSON:ITypedJSON) {
        this.installer = installer;
        this.configuration = configuration;
        this.rest = rest;
        this.typedJSON = typedJSON;
    }

    private apiLink(httpResponse, linkName) {
        return httpResponse.jsonBody().links[linkName];
    }

    createAutheticatedSession(installerProtocolHostAndOptionalPort:string, username:string, password:string):IThenable<IInstallerRestSession> {
        const restClientAsPromised = this.rest.newRestClientAsPromised(installerProtocolHostAndOptionalPort);
        const loginBody = {
            form: {
                username: username,
                password: password
            }
        };
        return restClientAsPromised.post(this.configuration.installerLoginPath, loginBody)
            .then(loginResponse => restClientAsPromised.get(this.configuration.installerAPIPath))
            .then(apiResponse => {
                return this.installer.newInstallerRestSession(
                    restClientAsPromised,
                    this.typedJSON.newJSONObject(apiResponse.jsonBody())
                );
            });
    }
}