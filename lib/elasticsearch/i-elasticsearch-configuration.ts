import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IElasticsearchConfiguration extends IJSONSerializable {
    elasticSearchURLTemplate:string;
}