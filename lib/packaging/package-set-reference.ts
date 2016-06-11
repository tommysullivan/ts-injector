import IPackageSet from "./i-package-set";
import IJSONObject from "../typed-json/i-json-object";
import IPackaging from "./i-packaging";
import IList from "../collections/i-list";
import IPackage from "./i-package";
import IPackageSets from "./i-package-sets";
import ISemanticVersion from "./i-semantic-version";

export default class PackageSetReference implements IPackageSet {
    private configJSON:IJSONObject;
    private packaging:IPackaging;
    private packageSets:IPackageSets;

    constructor(configJSON:IJSONObject, packaging:IPackaging, packageSets:IPackageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }

    private get referredPackageSetId():string {
        return this.configJSON.stringPropertyNamed('packageSetRef');
    }

    get id():string { return `reference-to-${this.referredPackageSetId}`; }
    get version():ISemanticVersion { return this.packaging.newSemanticVersion(this.configJSON.stringPropertyNamed('version')); }

    get packages():IList<IPackage> {
        return this.packageSets.setWithIdAndVersion(this.referredPackageSetId, this.version).packages.map(
            originalPackage => this.packaging.newPackageWithOverrides(
                originalPackage, 
                this.configJSON.hasPropertyNamed('operatingSystems')
                    ? this.configJSON.listNamed<string>('operatingSystems')
                    : null,
                this.configJSON.hasPropertyNamed('promotionLevel')
                    ? this.packaging.newPromotionLevel(this.configJSON.stringPropertyNamed('promotionLevel'))
                    : null,
                this.configJSON.hasPropertyNamed('tags')
                    ? this.configJSON.listNamed<string>('tags').clone()
                    : null
            )
        );
    }
}