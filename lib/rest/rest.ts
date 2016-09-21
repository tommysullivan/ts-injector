import {IPromiseFactory} from "../promise/i-promise-factory";
import {RestResponse} from "./rest-response";
import {RestConfiguration} from "./rest-configuration";
import {RestClientAsPromised} from "./rest-client-as-promised";
import {RestError} from "./rest-error";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IRest} from "./i-rest";
import {IRestClientAsPromised} from "./i-rest-client-as-promised";
import {IRestResponse} from "./i-rest-response";
import {IError} from "../errors/i-error";

export class Rest implements IRest {
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

    newRestClientAsPromised(baseURL?:string):IRestClientAsPromised {
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

    newRestResponse(error:any, nativeResponse:any, originalURL:string):IRestResponse {
        return new RestResponse(error, nativeResponse, originalURL, this.typedJSON);
    }

    newRestError(restResponse:RestResponse):IError {
        return new RestError(restResponse);
    }
}