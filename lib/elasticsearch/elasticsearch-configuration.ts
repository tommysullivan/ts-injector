import {IJSONObject} from "../typed-json/i-json-object";
import {IElasticsearchConfiguration} from "./i-elasticsearch-configuration";

export class ElasticSearchConfiguration implements IElasticsearchConfiguration {
    private elasticSearchConfigJSON:IJSONObject;

    constructor(elasticSearchConfigJSON:IJSONObject) {
        this.elasticSearchConfigJSON = elasticSearchConfigJSON;
    }

    get elasticSearchURLTemplate():string {
        return this.elasticSearchConfigJSON.getProperty<string>('elasticSearchURLTemplate');
    }

    toJSON():string {
        return this.elasticSearchConfigJSON.toJSON();
    }
}