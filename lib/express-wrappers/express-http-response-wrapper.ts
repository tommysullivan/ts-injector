import IHttpResponse from "../http/i-http-response";

export default class ExpressHttpResponseWrapper implements IHttpResponse {
    private nativeExpressHttpResponse:any;

    constructor(nativeExpressHttpResponse:any) {
        this.nativeExpressHttpResponse = nativeExpressHttpResponse;
    }

    sendStatus(code:number):IHttpResponse {
        this.nativeExpressHttpResponse.sendStatus(code);
        return this;
    }

    end(content?:any):void {
        this.nativeExpressHttpResponse.end(content);
    }

    redirect(url:string):void {
        this.nativeExpressHttpResponse.redirect(url);
    }

    on(...args:Array<any>):any {
        return this.nativeExpressHttpResponse.on(...args);
    }

    dest(...args:Array<any>):any {
        return this.nativeExpressHttpResponse.dest(...args);
    }

    once(...args:Array<any>):any {
        return this.nativeExpressHttpResponse.once(...args);
    }

    write(...args:Array<any>):any {
        return this.nativeExpressHttpResponse.write(...args);
    }

    removeListener(...args:Array<any>):any {
        return this.nativeExpressHttpResponse.removeListener(...args);
    }

    emit(...args:Array<any>):any {
        return this.nativeExpressHttpResponse.emit(...args);
    }
}