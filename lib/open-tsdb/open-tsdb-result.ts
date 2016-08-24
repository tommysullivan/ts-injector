import IList from "../collections/i-list";
import ICollections from "../collections/i-collections";
import ITypedJSON from "../typed-json/i-typed-json";
import IJSONObject from "../typed-json/i-json-object";
import IDictionary from "../collections/i-dictionary";

export default class OpenTSDBResult {

    private _soughtTags:IDictionary<string>;
    private metricName:string;
    private resultJSONArray:any;
    private collections:ICollections;
    private typedJSON:ITypedJSON;

    constructor(soughtTags:IDictionary<string>, metricName:string, resultJSONArray:any, collections:ICollections, typedJSON:ITypedJSON) {
        this._soughtTags = soughtTags;
        this.metricName = metricName;
        this.resultJSONArray = resultJSONArray;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }

    private get typedJSONResult():IJSONObject {
        return this.typedJSON.newJSONObject(this.resultJSONArray[0]);
    }

    get numberOfEntries():number {
        return this.timestamps.length;
    }

    get metric():string {
        return this.metricName;
    }

    get soughtTags():IDictionary<string> {
        return this._soughtTags;
    }

    get tags():IList<string> {
        return this.typedJSONResult.listNamed<string>('tags');
    }

    get timestamps():IList<string> {
        const firstResult = this.resultJSONArray[0];
        return firstResult == null
            ? this.collections.newEmptyList<string>()
            : this.typedJSONResult.dictionaryNamed<string>('dps').keys;
    }

    lastValue(lastTimestamp:string):number{
        const firstResult=this.resultJSONArray[0];
        const result=this.typedJSONResult.dictionaryNamed<string>('dps').get(lastTimestamp);
        return parseInt(result);
    }

    toString():string {
        return JSON.stringify({
            metric: this.metric,
            soughtTags: this.soughtTags.toJSON(),
            rawResultJSON: this.resultJSONArray
        }, null, 3);
    }

}