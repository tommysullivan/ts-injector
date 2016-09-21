import {IPhaseConfig} from "./i-phase-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {IPackageSetRefConfig} from "../packaging/i-package-set-ref-config";
import {IPackageConfig} from "../packaging/i-package-config";
import {PackageSetRefConfig} from "../packaging/package-set-ref-config";
import {PackageConfig} from "../packaging/package-config";

export class PhaseConfig implements IPhaseConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get name():string {
        return this.configJSON.stringPropertyNamed('name');
    }

    get packages():Array<IPackageConfig | IPackageSetRefConfig> {
        return this.configJSON.listOfJSONObjectsNamed('packages')
            .map(packageJSON => packageJSON.hasPropertyNamed('packageSetRef')
                ? new PackageSetRefConfig(packageJSON)
                : new PackageConfig(packageJSON)
            ).toArray();

    }
}