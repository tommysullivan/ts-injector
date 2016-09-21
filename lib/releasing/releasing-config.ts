import {IReleasingConfig} from "./i-releasing-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {IReleaseConfig} from "./i-release-config";
import {ReleaseConfig} from "./release-config";

export class ReleasingConfig implements IReleasingConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get releases():Array<IReleaseConfig> {
        return this.configJSON.listOfJSONObjectsNamed('releases')
            .map(releaseConfigJSON => new ReleaseConfig(releaseConfigJSON))
            .toArray();
    }
}