import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import IDictionary from "../collections/i-dictionary";

interface IHttpRequest {
    bodyAsJSONObject:IJSONObject;
    bodyAsListOfJSONObjects:IList<IJSONObject>;
    body:any;
    accepts(contentType:string):boolean;
    params:IDictionary<string>;
}

export default IHttpRequest;