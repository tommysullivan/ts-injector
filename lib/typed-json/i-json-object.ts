import {IDictionary} from "../collections/i-dictionary";
import {IList} from "../collections/i-list";
import {IJSONSerializable} from "./i-json-serializable";

export interface IJSONObject extends IJSONSerializable {
    toJSON():any;
    dictionaryNamed<T>(name:string):IDictionary<T>;
    jsonObjectNamed(name:string):IJSONObject;
    setProperty<T>(propertyName:string, value:T):IJSONObject;
    getProperty<T>(propertyName:string):T;
    stringPropertyNamed(propertyName:string):string;
    hasPropertyNamed(propertyName:string):boolean;
    numericPropertyNamed(propertyName:string):number;
    booleanPropertyNamed(propertyName:string):boolean;
    listNamed<T>(name:string):IList<T>;
    listNamedOrDefaultToEmpty<T>(name:string):IList<T>;
    listOfJSONObjectsNamed(name:string):IList<IJSONObject>;
    listOfJSONObjectsNamedOrDefaultToEmpty(name:string):IList<IJSONObject>;
    getPropertyAndReturnUndefinedIfNonExistant<T>(name:string):T;
}