import {RestResponse} from "./rest-response";
import {RestConfiguration} from "./rest-configuration";
import {RestClientAsPromised} from "./rest-client-as-promised";
import {RestError} from "./rest-error";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IRest} from "./i-rest";
import {IRestClientAsPromised} from "./i-rest-client-as-promised";
import {IRestResponse} from "./i-rest-response";
import {IError} from "../errors/i-error";
import {IFutures} from "../futures/i-futures";

export class Rest implements IRest {
    private futures:IFutures;
    private requestModule:any;
    private restConfiguration:RestConfiguration;
    private typedJSON:ITypedJSON;

    constructor(futures:IFutures, requestModule:any, restConfiguration:RestConfiguration, typedJSON:ITypedJSON) {
        this.futures = futures;
        this.requestModule = requestModule;
        this.restConfiguration = restConfiguration;
        this.typedJSON = typedJSON;
    }

    newRestClientAsPromised(baseURL?:string):IRestClientAsPromised {
        return new RestClientAsPromised(
            this.futures,
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