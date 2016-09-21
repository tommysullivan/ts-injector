import {IFeatureConfiguration} from "./i-feature-configuration";
import {IJSONObject} from "../typed-json/i-json-object";

export class FeatureConfiguration implements IFeatureConfiguration {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get file():string {
        return this.configJSON.getPropertyAndReturnUndefinedIfNonExistant<string>('file');
    }

}