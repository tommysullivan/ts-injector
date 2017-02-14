import {IRest} from "../common/i-rest";
import {IRestClient} from "../common/i-rest-client";
import {IRestResponse} from "../common/i-rest-response";
import {IError} from "../../errors/i-error";
import {RestClientForBrowser} from "./rest-client-for-browser";
import {IFutures} from "../../futures/i-futures";
import {RestError} from "../common/rest-error";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {RestResponseForBrowser} from "./rest-response-for-browser";

export class RESTForBrowser implements IRest {
    constructor(
        private nativeJQuery:any,
        private futures:IFutures,
        private typedJSON:ITypedJSON
    ) {}

    newRestClient(baseURL?:string):IRestClient {
        return new RestClientForBrowser(
            this.futures,
            this.nativeJQuery,
            (n, path) => this.newRestResponseForBrowser(n, path)
        );
    }

    newRestResponseForBrowser(nativeJQueryResponseBody:string, originalURL:string):IRestResponse {
        return new RestResponseForBrowser(
            nativeJQueryResponseBody,
            originalURL,
            this.typedJSON.jsonParser
        )
    }

    newRestError(restResponse:IRestResponse):IError {
        return new RestError(restResponse);
    }
}