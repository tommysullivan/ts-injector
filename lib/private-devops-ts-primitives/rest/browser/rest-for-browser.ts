import {IRestClient} from "../common/i-rest-client";
import {IRestResponse} from "../common/i-rest-response";
import {RestClientForBrowser} from "./rest-client-for-browser";
import {IFutures} from "../../futures/i-futures";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {RestResponseForBrowser} from "./rest-response-for-browser";
import {Rest} from "../common/rest";
import {ICollections} from "../../collections/i-collections";
import {IJQueryXHR} from "./i-jquery-xhr";

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
            this.newRestResponseForBrowser.bind(this)
        );
    }

    newRestResponseForBrowser(nativeJQueryResponseBody:string, originalURL:string, xhr:IJQueryXHR):IRestResponse {
        return new RestResponseForBrowser(
            nativeJQueryResponseBody,
            originalURL,
            this.typedJSON.jsonParser,
            this.typedJSON,
            xhr,
            this.collections
        )
    }
}