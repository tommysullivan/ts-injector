import {IJSONObject} from "../typed-json/i-json-object";
import {IReleaseConfig} from "./i-release-config";
import {IPhaseConfig} from "./i-phase-config";
import {PhaseConfig} from "./phase-config";

export class ReleaseConfig implements IReleaseConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get name():string {
        return this.configJSON.stringPropertyNamed('name');
    }

    get phases():Array<IPhaseConfig> {
        return this.configJSON.listOfJSONObjectsNamed('phases')
            .map(phaseConfigJSON=>new PhaseConfig(phaseConfigJSON))
            .toArray();
    }
}