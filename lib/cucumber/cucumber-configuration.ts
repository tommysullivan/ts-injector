import {IJSONObject} from "../typed-json/i-json-object";
import {ICucumberConfiguration} from "./i-cucumber-configuration";
import {IFeatureSetConfiguration} from "./i-feature-set-configuration";
import {FeatureSetConfiguration} from "./feature-set-configuration";

export class CucumberConfiguration implements ICucumberConfiguration {
    constructor(
        private cucumberConfigJSON:IJSONObject
    ) {}

    get embedAsyncErrorsInStepOutput():boolean {
        return this.cucumberConfigJSON.booleanPropertyNamed('embedAsyncErrorsInStepOutput');
    }

    get defaultCucumberStepTimeoutMS():number {
        return this.cucumberConfigJSON.numericPropertyNamed('defaultCucumberStepTimeoutMS');
    }

    get cucumberExecutablePath():string {
        return this.cucumberConfigJSON.stringPropertyNamed('cucumberExecutablePath');
    }

    get featureSets():Array<IFeatureSetConfiguration> {
        return this.cucumberConfigJSON.listOfJSONObjectsNamed('featureSets')
            .map(featureSetJSON=>this.newFeatureSetConfiguration((featureSetJSON))).toArray();
    }

    private newFeatureSetConfiguration(featureSetJSON:IJSONObject):IFeatureSetConfiguration {
        return new FeatureSetConfiguration(featureSetJSON);
    }

    toJSON():any { return this.cucumberConfigJSON.toJSON(); }
    toString():string { return this.cucumberConfigJSON.toString(); }
}