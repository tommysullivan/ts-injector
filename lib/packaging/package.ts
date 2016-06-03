import IPackage from "./i-package";
import IJSONObject from "../typed-json/i-json-object";
import IPackaging from "./i-packaging";
import ISemanticVersion from "./i-semantic-version";
import IPromotionLevel from "./i-promotion-level";
import IList from "../collections/i-list";
import PackageComparer from "./package-comparer";

export default class Package implements IPackage {
    private configJSON:IJSONObject;
    private packaging:IPackaging;
    private packageComparer:PackageComparer;

    constructor(configJSON:IJSONObject, packaging:IPackaging, packageComparer:PackageComparer) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageComparer = packageComparer;
    }

    get name():string {
        return this.configJSON.hasPropertyNamed('name')
            ? this.configJSON.stringPropertyNamed('name')
            : this.configJSON.stringPropertyNamed('package');
    }

    get version():ISemanticVersion {
        return this.packaging.newSemanticVersion(this.configJSON.stringPropertyNamed('version'));
    }

    get promotionLevel():IPromotionLevel {
        return this.packaging.newPromotionLevel(
            this.configJSON.stringPropertyNamed('promotionLevel')
        );
    }

    get supportedOperatingSystems():IList<string> {
        return this.configJSON.listNamed<string>('operatingSystems');
    }

    equals(other:IPackage):boolean {
        return this.packageComparer.equals(this, other);
    }

    get tags():IList<string> {
        return this.configJSON.listNamedOrDefaultToEmpty<string>('tags');
    }
}