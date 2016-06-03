import IPackageSet from "./i-package-set";
import IJSONObject from "../typed-json/i-json-object";
import IPackaging from "./i-packaging";
import IPromotionLevel from "./i-promotion-level";
import ISemanticVersion from "./i-semantic-version";
import IList from "../collections/i-list";
import IPackage from "./i-package";
import IPackageSets from "./i-package-sets";

export default class PackageSet implements IPackageSet {
    private configJSON:IJSONObject;
    private packaging:IPackaging;
    private packageSets:IPackageSets;

    constructor(configJSON:IJSONObject, packaging:IPackaging, packageSets:IPackageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }

    get id():string {
        return this.configJSON.stringPropertyNamed('id');
    }

    get packages():IList<IPackage> {
        return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(
            this.configJSON.listOfJSONObjectsNamed('packages'),
            this.packageSets
        );
    }

    get version():ISemanticVersion {
        return this.packaging.newSemanticVersion(this.configJSON.stringPropertyNamed('version'));
    }

    get promotionLevel():IPromotionLevel {
        return this.packaging.newPromotionLevel(this.configJSON.stringPropertyNamed('promotionLevel'));
    }

}