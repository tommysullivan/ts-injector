import {IFeatureSetConfiguration} from "./i-feature-set-configuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {IFeatureConfiguration} from "./i-feature-configuration";
import {FeatureConfiguration} from "./feature-configuration";
import {IFeatureSetRefConfiguration} from "./i-feature-set-ref-configuration";
import {FeatureSetRefConfiguration} from "./feature-set-ref-configuration";
import {IJSONValue} from "../typed-json/i-json-value";

export class FeatureSetConfiguration implements IFeatureSetConfiguration {
    constructor(
        private jsonConfig:IJSONObject
    ) {}

    get id():string {
        return this.jsonConfig.stringPropertyNamed('id');
    }

    get features():Array<IFeatureConfiguration | IFeatureSetRefConfiguration> {
        return this.jsonConfig.listOfJSONObjectsNamed('features')
            .map(j=>j.hasPropertyNamed('featureSetRef')
                ? new FeatureSetRefConfiguration(j)
                : new FeatureConfiguration(j)
            )
            .toArray();
    }

    toJSON():IJSONValue {
        return this.jsonConfig.toJSON();
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }
}