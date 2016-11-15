import {IJSONObject} from "./i-json-object";
import {ICollections} from "../collections/i-collections";
import {IDictionary} from "../collections/i-dictionary";
import {IList} from "../collections/i-list";
import {ITypedJSON} from "./i-typed-json";
import {IHash} from "../collections/i-hash";

export class JSONObject implements IJSONObject {

    constructor(
        private rawJSON:Object,
        private spacingForStringify:number,
        private collections:ICollections,
        private typedJSON:ITypedJSON,
        private maxConfigErrorOutputLength:number
    ) {}

    private throwPropertyWrongTypeError(name:string, expectedTypeName:string, actualTypeName:string):void {
        throw new Error(
            `Property "${name}" should be "${expectedTypeName}" but was a(n) ${actualTypeName} in configuration: ${this.toString().substr(0, this.maxConfigErrorOutputLength)}`
        );
    }
    
    private getTypedProperty<T>(name:string, expectedTypeName:string):T {
        const val = this.getProperty<T>(name);
        const actualTypeName = typeof(val);
        if(actualTypeName!=expectedTypeName) this.throwPropertyWrongTypeError(name, expectedTypeName, actualTypeName);
        return <T>val;
    }

    hasPropertyNamed(propertyName:string):boolean {
        return this.rawJSON.hasOwnProperty(propertyName);
    }

    getProperty<T>(name:string):T {
        if(!this.hasPropertyNamed(name)) throw new Error(`Missing property "${name}" in configuration: ${this.toString().substr(0, this.maxConfigErrorOutputLength)}`);
        return this.getPropertyAndReturnUndefinedIfNonExistant<T>(name);
    }

    getPropertyAndReturnUndefinedIfNonExistant<T>(name:string):T {
        return this.rawJSON[name];
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
        const rawObject = this.getTypedProperty<IHash<T>>(name, 'object');
        return this.collections.newDictionary<T>(rawObject);
    }

    setProperty<T>(name:string, value:T):IJSONObject {
        this.rawJSON[name]=value;
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

    toJSON():any {
        return JSON.parse(JSON.stringify(this.rawJSON));
    }

    toString():string {
        return JSON.stringify(this.rawJSON, null, this.spacingForStringify);
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