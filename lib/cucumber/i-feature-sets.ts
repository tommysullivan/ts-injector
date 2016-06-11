import IList from "../collections/i-list";
import IFeatureSet from "./i-feature-set";

interface IFeatureSets {
    setWithId(id:string):IFeatureSet;
    all:IList<IFeatureSet>;
}
export default IFeatureSets;