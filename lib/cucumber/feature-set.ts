import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";
import ICollections from "../collections/i-collections";
import IFeatureSet from "./i-feature-set";
import IFeatureSets from "./i-feature-sets";

export default class FeatureSet implements IFeatureSet {
    private configJSON:IJSONObject;
    private collections:ICollections;
    private featureSets:IFeatureSets;

    constructor(configJSON:IJSONObject, collections:ICollections, featureSets:IFeatureSets) {
        this.configJSON = configJSON;
        this.collections = collections;
        this.featureSets = featureSets;
    }

    get id():string {
        return this.configJSON.stringPropertyNamed('id');
    }

    get featureFilesInExecutionOrder():IList<string> {
        return this.configJSON.listOfJSONObjectsNamed('features').flatMap(
            f=> f.hasPropertyNamed('file')
                ? this.collections.newList<string>([f.stringPropertyNamed('file')])
                : this.featureSets.setWithId(f.stringPropertyNamed('featureSetRef')).featureFilesInExecutionOrder
        );
    }

    toJSON():any { return this.configJSON.toRawJSON(); }
    toString():any { return this.configJSON.toString(); }
}