import IJSONObject from "../typed-json/i-json-object";
import FeatureSet from "./feature-set";
import IList from "../collections/i-list";

export default class CucumberConfiguration {
    private cucumberConfigJSON:IJSONObject;

    constructor(cucumberConfigJSON:IJSONObject) {
        this.cucumberConfigJSON = cucumberConfigJSON;
    }

    get embedAsyncErrorsInStepOutput():boolean {
        return this.cucumberConfigJSON.booleanPropertyNamed('embedAsyncErrorsInStepOutput');
    }

    defaultCucumberStepTimeoutMS():number {
        return this.cucumberConfigJSON.numericPropertyNamed('defaultCucumberStepTimeoutMS');
    }

    cucumberExecutablePath():string {
        return this.cucumberConfigJSON.stringPropertyNamed('cucumberExecutablePath');
    }

    get featureSets():IList<FeatureSet> {
        return this.cucumberConfigJSON.listOfJSONObjectsNamed('featureSets').map(
            testSuiteJSON=>new FeatureSet(testSuiteJSON)
        )
    }

    toJSON():any { return this.cucumberConfigJSON.toRawJSON(); }
    toString():string { return this.cucumberConfigJSON.toString(); }
}