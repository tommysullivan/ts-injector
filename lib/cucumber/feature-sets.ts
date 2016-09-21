import {IFeatureSet} from "./i-feature-set";
import {IList} from "../collections/i-list";
import {IFeatureSets} from "./i-feature-sets";
import {ICucumber} from "./i-cucumber";
import {IFeatureSetConfiguration} from "./i-feature-set-configuration";
import {IFeatureSetRefConfiguration} from "./i-feature-set-ref-configuration";

export class FeatureSets implements IFeatureSets {
    constructor(
        private featureSetConfigurations:IList<IFeatureSetConfiguration>,
        private cucumber:ICucumber
    ) {}

    setWithId(id:string):IFeatureSet {
        return this.all.firstWhere(f=>f.id==id);
    }

    get all():IList<IFeatureSet> {
        return this.featureSetConfigurations.map(
            featureSetConfig=>this.cucumber.newFeatureSet(featureSetConfig, this)
        );
    }
}