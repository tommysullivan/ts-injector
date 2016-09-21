import {IFeatureSetRefConfiguration} from "./i-feature-set-ref-configuration";
import {IJSONObject} from "../typed-json/i-json-object";

export class FeatureSetRefConfiguration implements IFeatureSetRefConfiguration {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get featureSetRef():string {
        return this.configJSON.getPropertyAndReturnUndefinedIfNonExistant<string>('featureSetRef');
    }
}