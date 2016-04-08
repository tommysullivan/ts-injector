import RestClientAsPromised from "../rest/rest-client-as-promised";
import IThenable from "../promise/i-thenable";
import InstallerClientConfiguration from "./installer-client-configuration";
import IPromiseFactory from "../promise/i-promise-factory";
import IJSONObject from "../typed-json/i-json-object";

export default class InstallerProcess {
    private authedRestClient:RestClientAsPromised;
    private processJSON:IJSONObject;
    private clientConfig:InstallerClientConfiguration;
    private processResourceURL:string;
    private promiseFactory:IPromiseFactory;

    constructor(authedRestClient:RestClientAsPromised, processJSON:IJSONObject, clientConfig:InstallerClientConfiguration, processResourceURL:string, promiseFactory:IPromiseFactory) {
        this.authedRestClient = authedRestClient;
        this.processJSON = processJSON;
        this.clientConfig = clientConfig;
        this.processResourceURL = processResourceURL;
        this.promiseFactory = promiseFactory;
    }

    private checkOutcomePeriodically(stateChange:string, successState:string, resolve:Function, reject:Function) {
        this.authedRestClient.get(this.processResourceURL)
            .then(result => {
                var state = result.jsonBody().state;
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

    private performStateChange(stateChange, successState):IThenable<any> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            var patchArgs = {
                body: { state: stateChange },
                json: true
            };
            this.authedRestClient.patch(this.processResourceURL, patchArgs)
                .then(_=>this.checkOutcomePeriodically(stateChange, successState, resolve, reject));
        });
    }

    validate():any {
        return this.performStateChange('CHECKING', 'CHECKED');
    }

    provision() {
        return this.performStateChange('PROVISIONING', 'PROVISIONED');
    }

    install() {
        return this.performStateChange('INSTALLING', 'INSTALLED');
    }

    log():IThenable<string> {
        var httpOptions = {
            headers: {
                'Accept': 'text/plain'
            }
        }
        var url = this.processJSON.jsonObjectNamed('links').stringPropertyNamed('log');
        return this.authedRestClient.get(url, httpOptions)
            .then(response=>response.body());
    }
}