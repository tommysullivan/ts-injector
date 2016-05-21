import IJSONObject from "../typed-json/i-json-object";

export default class ElasticSearchResult {
    private resultJSON:IJSONObject;

    constructor(resultJSON:IJSONObject) {
        this.resultJSON = resultJSON;
    }

    get numberOfHits():number {
        return this.resultJSON.jsonObjectNamed('hits').numericPropertyNamed('total');
    }
}