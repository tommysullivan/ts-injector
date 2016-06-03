import IFeatureSet from "./i-feature-set";
import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import IFeatureSets from "./i-feature-sets";
import ICucumber from "./i-cucumber";

export default class FeatureSets implements IFeatureSets {
    private featureSetsJSONArray:IList<IJSONObject>;
    private cucumber:ICucumber;

    constructor(featureSetsJSONArray:IList<IJSONObject>, cucumber:ICucumber) {
        this.featureSetsJSONArray = featureSetsJSONArray;
        this.cucumber = cucumber;
    }

    setWithId(id:string):IFeatureSet {
        return this.all.firstWhere(f=>f.id==id);
    }

    get all():IList<IFeatureSet> {
        return this.featureSetsJSONArray.map(
            configJSON=>this.cucumber.newFeatureSet(configJSON, this)
        );
    }
}