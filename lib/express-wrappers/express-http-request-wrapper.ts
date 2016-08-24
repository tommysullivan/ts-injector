import IHttpRequest from "../http/i-http-request";
import ITypedJSON from "../typed-json/i-typed-json";
import ICollections from "../collections/i-collections";
import IJSONObject from "../typed-json/i-json-object";
import IDictionary from "../collections/i-dictionary";
import IList from "../collections/i-list";

export default class ExpressHttpRequestWrapper implements IHttpRequest {
    private nativeExpressHttpRequest:any;
    private typedJSON:ITypedJSON;
    private collections:ICollections;

    constructor(nativeExpressHttpRequest:any, typedJSON:ITypedJSON, collections:ICollections) {
        this.nativeExpressHttpRequest = nativeExpressHttpRequest;
        this.typedJSON = typedJSON;
        this.collections = collections;
    }

    accepts(contentType:string):boolean {
        return this.nativeExpressHttpRequest.accepts(contentType);
    }

    get bodyAsJSONObject():IJSONObject {
        return this.typedJSON.newJSONObject(JSON.parse(this.body));
    }

    get bodyAsListOfJSONObjects():IList<IJSONObject> {
        return this.collections.newList(JSON.parse(this.body)).map(i=>this.typedJSON.newJSONObject(i));
    }

    get body():any {
        return this.nativeExpressHttpRequest.body;
    }

    get bodyAsString():string {
        return this.body.toString();
    }
    
    get params():IDictionary<string> {
        return this.collections.newDictionary<string>(this.nativeExpressHttpRequest.params);
    }
    
    get contentType():string {
        return this.nativeExpressHttpRequest.get('Content-Type');
    }

    isContentType(contentType:string):boolean {
        return (this.nativeExpressHttpRequest.get('Content-Type') == contentType);
    }

}