import {IList} from "../collections/i-list";
import {IFeatureSet} from "./i-feature-set";

export interface IFeatureSets {
    setWithId(id:string):IFeatureSet;
    all:IList<IFeatureSet>;
}