import {IInstallerRestSession} from "./i-installer-rest-session";
import {IFuture} from "../futures/i-future";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IInstallerRestClient} from "./i-installer-rest-client";
import {IInstallerClientConfiguration} from "./i-installer-client-configuration";
import {IInstaller} from "./i-installer";
import {IRest} from "../rest/i-rest";

export class InstallerRestClient implements IInstallerRestClient {

    constructor(
        private installer:IInstaller,
        private configuration:IInstallerClientConfiguration,
        private rest:IRest,
        private typedJSON:ITypedJSON
    ) {}

    private apiLink(httpResponse, linkName) {
        return httpResponse.jsonBody.links[linkName];
    }

    createAutheticatedSession(installerProtocolHostAndOptionalPort:string, username:string, password:string):IFuture<IInstallerRestSession> {
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
                    this.typedJSON.newJSONObject(apiResponse.jsonBody)
                );
            });
    }
}