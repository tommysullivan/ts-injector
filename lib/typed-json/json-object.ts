import IJSONObject from "./i-json-object";
import ICollections from "../collections/i-collections";
import IDictionary from "../collections/i-dictionary";
import IList from "../collections/i-list";
import ITypedJSON from "./i-typed-json";

export default class JSONObject implements IJSONObject {
    private jsonObject:Object;
    private spacingForStringify:number;
    private collections:ICollections;
    private typedJSON:ITypedJSON;

    constructor(jsonObject:Object, spacingForStringify:number, collections:ICollections, typedJSON:ITypedJSON) {
        this.jsonObject = jsonObject;
        this.spacingForStringify = spacingForStringify;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }

    private throwPropertyWrongTypeError(name:string, expectedTypeName:string, actualTypeName:string):void {
        throw new Error(
            `Property "${name}" should be "${expectedTypeName}" but was a(n) ${actualTypeName} in configuration: ${this.toString()}`
        );
    }
    
    private getTypedProperty<T>(name:string, expectedTypeName:string):T {
        const val = this.getProperty<T>(name);
        const actualTypeName = typeof(val);
        if(actualTypeName!=expectedTypeName) this.throwPropertyWrongTypeError(name, expectedTypeName, actualTypeName);
        return <T>val;
    }

    hasPropertyNamed(propertyName:string):boolean {
        return this.jsonObject.hasOwnProperty(propertyName);
    }

    getProperty<T>(name:string):T {
        if(!this.hasPropertyNamed(name)) throw new Error(`Missing property "${name}" in configuration: ${this.toString()}`);
        return this.jsonObject[name];
    }

    jsonObjectNamed(name:string):IJSONObject {
        return this.typedJSON.newJSONObject(this.getProperty(name));
    }

    listOfJSONObjectsNamed(name:string):IList<IJSONObject> {
        return this.listNamed<Object>(name).map(i=>this.typedJSON.newJSONObject(i));
    }

    listOfJSONObjectsNamedOrDefaultToEmpty(name:string):IList<IJSONObject> {
        try {
            return this.listOfJSONObjectsNamed(name);
        }
        catch(e) {
            return this.collections.newEmptyList<IJSONObject>();
        }
    }

    dictionaryNamed<T>(name:string):IDictionary<T> {
        const rawObject = this.getTypedProperty<Object>(name, 'object');
        return this.collections.newDictionary<T>(rawObject);
    }

    setProperty<T>(name:string, value:T):IJSONObject {
        this.jsonObject[name]=value;
        return this;
    }

    stringPropertyNamed(name:string):string {
        return this.getTypedProperty<string>(name, 'string');
    }

    numericPropertyNamed(name:string):number {
        return this.getTypedProperty<number>(name, 'number');
    }

    booleanPropertyNamed(name:string):boolean {
        return this.getTypedProperty<boolean>(name, 'boolean');
    }

    toRawJSON():any {
        return JSON.parse(JSON.stringify(this.jsonObject));
    }

    toString():string {
        return JSON.stringify(this.jsonObject, null, this.spacingForStringify);
    }

    listNamed<T>(name:string):IList<T> {
        const rawArray = this.getProperty<Array<T>>(name);
        if(!this.typedJSON.isArray(rawArray)) this.throwPropertyWrongTypeError(name, 'array', 'unknown (but not native array)')
        return this.collections.newList<T>(rawArray);
    }

    listNamedOrDefaultToEmpty<T>(name:string):IList<T> {
        return this.hasPropertyNamed(name)
            ? this.listNamed<T>(name)
            : this.collections.newEmptyList<T>();
    }
}