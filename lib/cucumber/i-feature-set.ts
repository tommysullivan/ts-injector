import IList from "../collections/i-list";

interface IFeatureSet {
    id:string;
    featureFilesInExecutionOrder:IList<string>;
}
export default IFeatureSet;