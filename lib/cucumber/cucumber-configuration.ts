import {IJSONObject} from "../typed-json/i-json-object";
import {ICucumberConfiguration} from "./i-cucumber-configuration";
import {IFeatureSetConfiguration} from "./i-feature-set-configuration";
import {FeatureSetConfiguration} from "./feature-set-configuration";
import {IPath} from "../node-js-wrappers/i-path";
import {IJSONValue} from "../typed-json/i-json-value";

export class CucumberConfiguration implements ICucumberConfiguration {
    constructor(
        private cucumberConfigJSON:IJSONObject,
        private basePathToUseForConfiguredRelativePaths:string,
        private path:IPath
    ) {}

    get cucumberOutputPath():string {
        return this.path.join(
            this.basePathToUseForConfiguredRelativePaths,
            this.cucumberConfigJSON.stringPropertyNamed('cucumberOutputPathRelativeToThisConfigFile')
        );
    }

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

    toJSON():IJSONValue { return this.cucumberConfigJSON.toJSON(); }
    toString():string { return this.cucumberConfigJSON.toString(); }
}