import {RestResponseForNodeJS} from "./rest-response-for-node-js";
import {RestClientForNodeJS} from "../nodejs/rest-client-for-node-js";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IRestClient} from "../common/i-rest-client";
import {IRestResponse} from "../common/i-rest-response";
import {IFutures} from "../../futures/i-futures";
import {INativeServerRequestModule} from "../nodejs/i-request-module";
import {IRestForNodeJS} from "./i-rest-for-node-js";
import {INativeServerRequestor} from "./i-native-server-requestor";
import {INativeServerResponse} from "./i-native-server-response";
import {IRestConfiguration} from "../common/i-rest-configuration";
import {ICollections} from "../../collections/i-collections";
import {Rest} from "../common/rest";

export class RestForNodeJS extends Rest implements IRestForNodeJS {

    constructor(
        private futures:IFutures,
        private requestModule:INativeServerRequestModule,
        private restConfiguration:IRestConfiguration,
        private typedJSON:ITypedJSON,
        collections:ICollections
    ) {
        super(collections);
    }

    newRestClient(baseURL?:string):IRestClient {
        return new RestClientForNodeJS(
            this.futures,
            this.newNativeServerRequestor(),
            baseURL,
            this,
            this,
            this.singletonHTTPClientCache
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
            this.typedJSON.jsonParser,
            this.collections
        );
    }
}