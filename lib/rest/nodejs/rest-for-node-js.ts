import {RestResponseForNodeJS} from "./rest-response-for-node-js";
import {RestClientForNodeJS} from "../nodejs/rest-client-for-node-js";
import {RestError} from "../common/rest-error";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IRestClient} from "../common/i-rest-client";
import {IRestResponse} from "../common/i-rest-response";
import {IError} from "../../errors/i-error";
import {IFutures} from "../../futures/i-futures";
import {INativeServerRequestModule} from "../nodejs/i-request-module";
import {IRestForNodeJS} from "./i-rest-for-node-js";
import {INativeServerRequestor} from "./i-native-server-requestor";
import {INativeServerResponse} from "./i-native-server-response";
import {IRestConfiguration} from "../common/i-rest-configuration";

export class RestForNodeJS implements IRestForNodeJS {
    private futures:IFutures;
    private requestModule:INativeServerRequestModule;
    private restConfiguration:IRestConfiguration;
    private typedJSON:ITypedJSON;

    constructor(futures:IFutures, requestModule:INativeServerRequestModule, restConfiguration:IRestConfiguration, typedJSON:ITypedJSON) {
        this.futures = futures;
        this.requestModule = requestModule;
        this.restConfiguration = restConfiguration;
        this.typedJSON = typedJSON;
    }

    newRestClient(baseURL?:string):IRestClient {
        return new RestClientForNodeJS(
            this.futures,
            this.newNativeServerRequestor(),
            baseURL,
            this,
            this
        );
    }

    newNativeServerRequestor():INativeServerRequestor {
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

    newRestResponse(error:Error, nativeResponse:INativeServerResponse, originalURL:string):IRestResponse {
        return new RestResponseForNodeJS(
            error,
            nativeResponse,
            originalURL,
            this.typedJSON,
            this.typedJSON.jsonParser
        );
    }

    newRestError(restResponse:RestResponseForNodeJS):IError {
        return new RestError(restResponse);
    }
}