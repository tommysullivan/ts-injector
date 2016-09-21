import {IFuture} from "../promise/i-future";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IRestClientAsPromised} from "./i-rest-client-as-promised";
import {IRest} from "./i-rest";
import {IRestResponse} from "./i-rest-response";

export class RestClientAsPromised implements IRestClientAsPromised {
    constructor(
        private promiseFactory:IPromiseFactory,
        private requestor:any,
        private baseUrl:string,
        private rest:IRest
    ) {}

    post(path:string, options?:any):IFuture<IRestResponse> {
        return this.request(this.requestor.post, path, options);
    }

    get(path:string, options?:any):IFuture<IRestResponse> {
        return this.request(this.requestor.get, path, options);
    }

    patch(path:string, options?:any):IFuture<IRestResponse> {
        return this.request(this.requestor.patch, path, options);
    }

    delete(path:string, options?:any):IFuture<IRestResponse> {
        return this.request(this.requestor.delete, path, options);
    }

    put(path:string, options?:any):IFuture<IRestResponse> {
        return this.request(this.requestor.put, path, options);
    }

    private request(method:Function, path:string, options?:any):IFuture<IRestResponse> {
        const url = path.indexOf('://')>=0 ? path : this.baseUrl + path;
        return this.promiseFactory.newPromise((resolve, reject) => {
            const responseHandler = (error, response, body) => {
                const responseWrapper = this.rest.newRestResponse(error, response, url);
                if(responseWrapper.isError) reject(this.rest.newRestError(responseWrapper));
                else resolve(responseWrapper);
            };
            method.call(this.requestor, url, options, responseHandler.bind(this));
        });
    }
}