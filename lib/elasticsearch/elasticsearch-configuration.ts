import IJSONObject from "../typed-json/i-json-object";

export default class ElasticSearchConfiguration {
    private elasticSearchConfigJSON:IJSONObject;

    constructor(elasticSearchConfigJSON:IJSONObject) {
        this.elasticSearchConfigJSON = elasticSearchConfigJSON;
    }

    get elasticSearchURLTemplate():string {
        return this.elasticSearchConfigJSON.getProperty<string>('elasticSearchURLTemplate');
    }
}