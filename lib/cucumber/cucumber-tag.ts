import ICucumberTag from "./i-cucumber-tag";
import IJSONObject from "../typed-json/i-json-object";

export default class CucumberTag implements ICucumberTag {
    private tagJSON:IJSONObject;

    constructor(tagJSON:any) {
        this.tagJSON = tagJSON;
    }

    name():string { return this.tagJSON.stringPropertyNamed('name'); }
}