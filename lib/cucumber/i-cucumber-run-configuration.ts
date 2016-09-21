import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IHash} from "../collections/i-hash";

export interface ICucumberRunConfiguration extends IJSONSerializable {
    environmentVariables:IHash<string>;
    jsonResultFilePath:string;
    cucumberAdditionalArgs:string;
    isDryRun:boolean;
}