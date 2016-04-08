import IExpressApplication from "./i-express-application";
import ExpressApplication from "./express-application";
import IPromiseFactory from "../promise/i-promise-factory";
import IHTTP from "../http/i-http";
import IHttpRequest from "../http/i-http-request";
import ExpressHttpRequestWrapper from "./express-http-request-wrapper";
import ITypedJSON from "../typed-json/i-typed-json";
import ICollections from "../collections/i-collections";
import IHttpResponse from "../http/i-http-response";
import ExpressHttpResponseWrapper from "./express-http-response-wrapper";

export default class ExpressWrappers {
    private nativeExpressModule:any;
    private promiseFactory:IPromiseFactory;
    private bodyParser:any;
    private http:IHTTP;
    private typedJSON:ITypedJSON;
    private collections:ICollections;

    constructor(nativeExpressModule:any, promiseFactory:IPromiseFactory, bodyParser:any, http:IHTTP, typedJSON:ITypedJSON, collections:ICollections) {
        this.nativeExpressModule = nativeExpressModule;
        this.promiseFactory = promiseFactory;
        this.bodyParser = bodyParser;
        this.http = http;
        this.typedJSON = typedJSON;
        this.collections = collections;
    }

    newExpressHttpRequest(nativeExpressHttpRequest:any):IHttpRequest {
        return new ExpressHttpRequestWrapper(
            nativeExpressHttpRequest,
        this.typedJSON,
        this.collections)
    }

    newExpressHttpResponse(nativeExpressHttpResponse:any):IHttpResponse {
        return new ExpressHttpResponseWrapper(nativeExpressHttpResponse);
    }

    newExpressApplication():IExpressApplication {
        return new ExpressApplication(
            this.bodyParser,
            this.nativeExpressModule,
            this.nativeExpressModule(),
            this.promiseFactory,
            this.http,
            this
        );
    }
}