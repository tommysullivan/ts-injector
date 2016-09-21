import {IPackageSetRefConfig} from "./i-package-set-ref-config";
import {IJSONObject} from "../typed-json/i-json-object";

export class PackageSetRefConfig implements IPackageSetRefConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get packageSetRef():string {
        return this.configJSON.stringPropertyNamed('packageSetRef');
    }

    get version():string {
        return this.configJSON.stringPropertyNamed('version');
    }

    get operatingSystems():Array<string> {
        return this.configJSON.getPropertyAndReturnUndefinedIfNonExistant<Array<string>>('operatingSystems');
    }

    get promotionLevel():string {
        return this.configJSON.getPropertyAndReturnUndefinedIfNonExistant<string>('promotionLevel');
    }

    get tags():Array<string> {
        return this.configJSON.getPropertyAndReturnUndefinedIfNonExistant<Array<string>>('tags');
    }

}