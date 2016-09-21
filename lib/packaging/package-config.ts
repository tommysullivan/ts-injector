import {IPackageConfig} from "./i-package-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {PromotionLevels} from "./promotion-levels";

export class PackageConfig implements IPackageConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get package():string {
        return this.configJSON.getPropertyAndReturnUndefinedIfNonExistant<string>('package');
    }

    get name():string {
        return this.configJSON.getPropertyAndReturnUndefinedIfNonExistant<string>('name');
    }

    get version():string {
        return this.configJSON.stringPropertyNamed('version');
    }

    get promotionLevel():PromotionLevels {
        return this.configJSON.getProperty<PromotionLevels>('promotionLevel');
    }

    get operatingSystems():Array<string> {
        return this.configJSON.listNamed<string>('operatingSystems').toArray();
    }

    get tags():Array<string> {
        return this.configJSON.listNamed<string>('tags').toArray();
    }

}