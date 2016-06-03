import IPackageSets from "./i-package-sets";
import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";
import IPackaging from "./i-packaging";
import IPackageSet from "./i-package-set";
import ISemanticVersion from "./i-semantic-version";

export default class PackageSets implements IPackageSets {
    private listOfPackageSetJSONs:IList<IJSONObject>;
    private packaging:IPackaging;

    constructor(listOfPackageSetJSONs:IList<IJSONObject>, packaging:IPackaging) {
        this.listOfPackageSetJSONs = listOfPackageSetJSONs;
        this.packaging = packaging;
    }

    setWithIdAndVersion(soughtId:string, version:ISemanticVersion):IPackageSet {
        return this.all.firstWhere(p=>p.id==soughtId && p.version.matches(version.toString()));
    }

    get all():IList<IPackageSet> {
        return this.listOfPackageSetJSONs.map(packageSetJSON=>this.packaging.newPackageSet(packageSetJSON, this));
    }
}