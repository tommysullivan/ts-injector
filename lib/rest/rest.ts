import IPromiseFactory from "../promise/i-promise-factory";
import RestResponse from "./rest-response";
import RestConfiguration from "./rest-configuration";
import RestClientAsPromised from "./rest-client-as-promised";
import RestError from "./rest-error";
import ITypedJSON from "../typed-json/i-typed-json";

export default class Rest {
    private promiseFactory:IPromiseFactory;
    private requestModule:any;
    private restConfiguration:RestConfiguration;
    private typedJSON:ITypedJSON;

    constructor(promiseFactory:IPromiseFactory, requestModule:any, restConfiguration:RestConfiguration, typedJSON:ITypedJSON) {
        this.promiseFactory = promiseFactory;
        this.requestModule = requestModule;
        this.restConfiguration = restConfiguration;
        this.typedJSON = typedJSON;
    }

    newRestClientAsPromised(baseURL?:string):RestClientAsPromised {
        return new RestClientAsPromised(
            this.promiseFactory,
            this.newJSONRequestorWithCookies(),
            baseURL,
            this
        );
    }

    newJSONRequestorWithCookies():any {
        this.requestModule.debug = this.restConfiguration.debugHTTP;
        return this.requestModule.defaults({
            jar: true,
            agentOptions: {
                rejectUnauthorized: false
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    newRestResponse(error:any, nativeResponse:any, originalURL:string):RestResponse {
        return new RestResponse(error, nativeResponse, originalURL, this.typedJSON);
    }

    newRestError(restResponse:RestResponse):RestError {
        return new RestError(restResponse);
    }
}