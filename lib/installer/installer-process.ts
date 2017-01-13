import {IJSONObject} from "../typed-json/i-json-object";
import {IInstallerProcess} from "./i-installer-process";
import {IRestClient} from "../rest/common/i-rest-client";
import {IInstallerClientConfiguration} from "./i-installer-client-configuration";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";

export class InstallerProcess implements IInstallerProcess {
    constructor(
        private authedRestClient:IRestClient,
        private processJSON:IJSONObject,
        private clientConfig:IInstallerClientConfiguration,
        private processResourceURL:string,
        private futures:IFutures
    ) {}

    private checkOutcomePeriodically(stateChange:string, successState:string, resolve:Function, reject:Function) {
        this.authedRestClient.get(this.processResourceURL)
            .then(result => {
                const state = result.bodyAsJsonObject.stringPropertyNamed('state');
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
        return this.futures.newFuture((resolve, reject) => {
            const patchArgs = { state: stateChange };
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
        const url = this.processJSON.jsonObjectNamed('links').stringPropertyNamed('log');
        return this.authedRestClient.getPlainText(url)
            .then(response=>response.body);
    }
}