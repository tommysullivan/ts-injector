import {IList} from "../collections/i-list";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface ICucumberTestResult extends IJSONSerializable {
    uniqueTagNames:IList<string>;
    consoleOutput:string;
    passed:boolean;
}