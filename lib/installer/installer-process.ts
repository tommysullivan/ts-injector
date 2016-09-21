import {IFuture} from "../promise/i-future";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IJSONObject} from "../typed-json/i-json-object";
import {IInstallerProcess} from "./i-installer-process";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IInstallerClientConfiguration} from "./i-installer-client-configuration";

export class InstallerProcess implements IInstallerProcess {
    constructor(
        private authedRestClient:IRestClientAsPromised,
        private processJSON:IJSONObject,
        private clientConfig:IInstallerClientConfiguration,
        private processResourceURL:string,
        private promiseFactory:IPromiseFactory
    ) {}

    private checkOutcomePeriodically(stateChange:string, successState:string, resolve:Function, reject:Function) {
        this.authedRestClient.get(this.processResourceURL)
            .then(result => {
                const state = result.jsonBody.state;
                if(state == stateChange)
                    setTimeout(
                        ()=>this.checkOutcomePeriodically(stateChange, successState, resolve, reject),
                        this.clientConfig.installerPollingFrequencyMS
                    );
                else {
                    if(state==successState) resolve(null);
                    else reject(new Error(`Unexpected process state ${state}`));
                }
            });
    }

    private performStateChange(stateChange, successState):IFuture<any> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            const patchArgs = {
                body: { state: stateChange },
                json: true
            };
            this.authedRestClient.patch(this.processResourceURL, patchArgs)
                .then(_=>this.checkOutcomePeriodically(stateChange, successState, resolve, reject));
        });
    }

    validate():IFuture<any> {
        return this.performStateChange('CHECKING', 'CHECKED');
    }

    provision():IFuture<any> {
        return this.performStateChange('PROVISIONING', 'PROVISIONED');
    }

    install():IFuture<any> {
        return this.performStateChange('INSTALLING', 'INSTALLED');
    }

    log():IFuture<string> {
        const httpOptions = {
            headers: {
                'Accept': 'text/plain'
            }
        }
        const url = this.processJSON.jsonObjectNamed('links').stringPropertyNamed('log');
        return this.authedRestClient.get(url, httpOptions)
            .then(response=>response.body);
    }
}