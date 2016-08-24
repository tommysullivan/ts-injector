interface IHttpResponse {
    sendStatus(code:number):IHttpResponse;
    end(content?:any):void;
    redirect(url:string):void;
    location(resourcePath:string):void;
}

export default IHttpResponse;