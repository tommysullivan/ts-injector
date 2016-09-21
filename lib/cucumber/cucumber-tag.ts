import {ICucumberTag} from "./i-cucumber-tag";
import {IJSONObject} from "../typed-json/i-json-object";

export class CucumberTag implements ICucumberTag {
    private tagJSON:IJSONObject;

    constructor(tagJSON:any) {
        this.tagJSON = tagJSON;
    }

    get name():string { return this.tagJSON.stringPropertyNamed('name'); }

    toJSON():any {
        return this.tagJSON.toJSON();
    }
}