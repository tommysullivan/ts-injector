import {IPackageSetConfig} from "./i-package-set-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {IPackageConfig} from "./i-package-config";
import {PackageConfig} from "./package-config";
import {IPackageSetRefConfig} from "./i-package-set-ref-config";
import {PackageSetRefConfig} from "./package-set-ref-config";

export class PackageSetConfig implements IPackageSetConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get id():string {
        return this.configJSON.stringPropertyNamed('id');
    }

    get packages():Array<IPackageConfig | IPackageSetRefConfig> {
        return this.configJSON.listOfJSONObjectsNamed('packages')
            .map(packageConfigJSON => packageConfigJSON.hasPropertyNamed('packageSetRef')
                ? new PackageSetRefConfig(packageConfigJSON)
                : new PackageConfig(packageConfigJSON)
            )
            .toArray();
    }

    get promotionLevel():string {
        return this.configJSON.stringPropertyNamed('promotionLevel');
    }

    get version():string {
        return this.configJSON.stringPropertyNamed('version');
    }
}