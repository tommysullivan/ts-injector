import {IList} from "../collections/i-list";

export interface IFeatureSet {
    id:string;
    featureFilesInExecutionOrder:IList<string>;
}