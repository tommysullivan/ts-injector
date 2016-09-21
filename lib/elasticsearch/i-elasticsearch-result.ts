import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IElasticsearchResult extends IJSONSerializable {
    numberOfHits:number;
}