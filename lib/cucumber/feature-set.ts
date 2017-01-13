import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";
import {IFeatureSet} from "./i-feature-set";
import {IFeatureSets} from "./i-feature-sets";
import {IFeatureSetConfiguration} from "./i-feature-set-configuration";
import {IFeatureSetRefConfiguration} from "./i-feature-set-ref-configuration";
import {IFeatureConfiguration} from "./i-feature-configuration";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IJSONValue} from "../typed-json/i-json-value";

export class FeatureSet implements IFeatureSet {

    constructor(
        private featureSetConfiguration:IFeatureSetConfiguration,
        private collections:ICollections,
        private featureSets:IFeatureSets,
        private jsonSerializer:IJSONSerializer
    ) {}

    get id():string {
        return this.featureSetConfiguration.id;
    }

    private referencedFeatureFiles(config:IFeatureSetRefConfiguration):IList<string> {
        return this.featureSets.setWithId(
            config.featureSetRef
        ).featureFilesInExecutionOrder;
    }

    private immediateFeatureFiles(config:IFeatureConfiguration):IList<string> {
        return this.collections.newList(
            [config.file]
        )
    }

    get featureFilesInExecutionOrder():IList<string> {
        const featureAndFeatureSetRefConfigs = this.collections.newList(
            this.featureSetConfiguration.features
        );
        return featureAndFeatureSetRefConfigs.flatMap(
            f => (<IFeatureSetRefConfiguration> f).featureSetRef != null
                ? this.referencedFeatureFiles(<IFeatureSetRefConfiguration> f)
                : this.immediateFeatureFiles(<IFeatureConfiguration> f)
        );
    }

    toJSON():IJSONValue { return this.jsonSerializer.serialize(this.featureSetConfiguration); }
    toString():any { return JSON.stringify(this.toJSON(), null, 3); }
}