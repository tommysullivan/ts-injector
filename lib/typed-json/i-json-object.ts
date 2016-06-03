import IDictionary from "../collections/i-dictionary";
import IList from "../collections/i-list";

interface IJSONObject {
    dictionaryNamed<T>(name:string):IDictionary<T>;
    jsonObjectNamed(name:string):IJSONObject;
    setProperty<T>(propertyName:string, value:T):IJSONObject;
    getProperty<T>(propertyName:string):T;
    stringPropertyNamed(propertyName:string):string;
    hasPropertyNamed(propertyName:string):boolean;
    numericPropertyNamed(propertyName:string):number;
    booleanPropertyNamed(propertyName:string):boolean;
    toRawJSON():any;
    listNamed<T>(name:string):IList<T>;
    listNamedOrDefaultToEmpty<T>(name:string):IList<T>;
    listOfJSONObjectsNamed(name:string):IList<IJSONObject>;
    listOfJSONObjectsNamedOrDefaultToEmpty(name:string):IList<IJSONObject>;
    toString():string;
}

export default IJSONObject;