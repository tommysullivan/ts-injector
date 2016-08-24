import IThenable from "../promise/i-thenable";
import RestResponse from "./rest-response";
import IPromiseFactory from "../promise/i-promise-factory";
import Rest from "./rest";

export default class RestClientAsPromised {
    private promiseFactory:IPromiseFactory;
    private requestor:any;
    private baseUrl:string;
    private rest:Rest;

    constructor(promiseFactory:IPromiseFactory, requestor:any, baseUrl:string, rest:Rest) {
        this.promiseFactory = promiseFactory;
        this.requestor = requestor;
        this.baseUrl = baseUrl;
        this.rest = rest;
    }

    post(path:string, options?:any):IThenable<RestResponse> {
        return this.request(this.requestor.post, path, options);
    }

    get(path:string, options?:any):IThenable<RestResponse> {
        return this.request(this.requestor.get, path, options);
    }

    patch(path:string, options?:any):IThenable<RestResponse> {
        return this.request(this.requestor.patch, path, options);
    }

    delete(path:string, options?:any):IThenable<RestResponse> {
        return this.request(this.requestor.delete, path, options);
    }

    put(path:string, options?:any):IThenable<RestResponse> {
        return this.request(this.requestor.put, path, options);
    }

    request(method:Function, path:string, options?:any):IThenable<RestResponse> {
        const url = path.indexOf('://')>=0 ? path : this.baseUrl + path;
        return this.promiseFactory.newPromise((resolve, reject) => {
            const responseHandler = (error, response, body) => {
                const responseWrapper = this.rest.newRestResponse(error, response, url);
                if(responseWrapper.isError()) reject(this.rest.newRestError(responseWrapper));
                else resolve(responseWrapper);
            };
            method.call(this.requestor, url, options, responseHandler.bind(this));
        });
    }
}