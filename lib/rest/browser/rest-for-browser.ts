import {IRestClient} from "../common/i-rest-client";
import {IRestResponse} from "../common/i-rest-response";
import {RestClientForBrowser} from "./rest-client-for-browser";
import {IFutures} from "../../futures/i-futures";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {RestResponseForBrowser} from "./rest-response-for-browser";
import {Rest} from "../common/rest";
import {ICollections} from "../../collections/i-collections";

export class RESTForBrowser extends Rest {
    constructor(
        private nativeJQuery:any,
        private futures:IFutures,
        private typedJSON:ITypedJSON,
        collections:ICollections
    ) {
        super(collections);
    }

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
            this.typedJSON.jsonParser,
            this.typedJSON
        )
    }
}