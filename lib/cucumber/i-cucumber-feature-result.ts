import {IList} from "../collections/i-list";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface ICucumberFeatureResult extends IJSONSerializable {
    uniqueTagNames:IList<string>;
}