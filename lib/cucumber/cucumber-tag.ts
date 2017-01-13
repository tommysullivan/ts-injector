import {ICucumberTag} from "./i-cucumber-tag";
import {IJSONObject} from "../typed-json/i-json-object";
import {IJSONValue} from "../typed-json/i-json-value";

export class CucumberTag implements ICucumberTag {
    private tagJSON:IJSONObject;

    constructor(tagJSON:IJSONObject) {
        this.tagJSON = tagJSON;
    }

    get name():string { return this.tagJSON.stringPropertyNamed('name'); }

    toJSON():IJSONValue {
        return this.tagJSON.toJSON();
    }
}