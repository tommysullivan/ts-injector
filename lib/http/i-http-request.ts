import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import IDictionary from "../collections/i-dictionary";

interface IHttpRequest {
    bodyAsJSONObject:IJSONObject;
    bodyAsListOfJSONObjects:IList<IJSONObject>;
    body:any;
    bodyAsString:string;
    accepts(contentType:string):boolean;
    params:IDictionary<string>;
    contentType:string;
    isContentType(contentType:string):boolean;
}

export default IHttpRequest;