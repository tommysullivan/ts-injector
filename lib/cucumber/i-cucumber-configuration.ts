import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IFeatureSetConfiguration} from "./i-feature-set-configuration";

export interface ICucumberConfiguration extends IJSONSerializable {
    embedAsyncErrorsInStepOutput:boolean;
    defaultCucumberStepTimeoutMS:number;
    cucumberExecutablePath:string;
    featureSets:Array<IFeatureSetConfiguration>;
}