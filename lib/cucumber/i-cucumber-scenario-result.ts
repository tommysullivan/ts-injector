import {IList} from "../collections/i-list";
import {ICucumberTag} from "./i-cucumber-tag";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface ICucumberScenarioResult extends IJSONSerializable {
    tags:IList<ICucumberTag>;
}