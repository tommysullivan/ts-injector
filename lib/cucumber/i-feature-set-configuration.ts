import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IFeatureConfiguration} from "./i-feature-configuration";
import {IFeatureSetRefConfiguration} from "./i-feature-set-ref-configuration";

export interface IFeatureSetConfiguration extends IJSONSerializable {
    id:string;
    features:Array<IFeatureConfiguration | IFeatureSetRefConfiguration>;
}