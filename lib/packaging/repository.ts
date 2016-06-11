import IRepository from "./i-repository";
import IJSONObject from "../typed-json/i-json-object";
import IPackaging from "./i-packaging";
import IPackageSets from "./i-package-sets";
import IList from "../collections/i-list";
import IPackage from "./i-package";

export default class Repository implements IRepository {

    private configJSON:IJSONObject;
    private packaging:IPackaging;
    private packageSets:IPackageSets;

    constructor(configJSON:IJSONObject, packaging:IPackaging, packageSets:IPackageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }

    get url():string {
        return this.configJSON.stringPropertyNamed('url');
    }

    get packages():IList<IPackage> {
        return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(
            this.configJSON.listOfJSONObjectsNamed('packages'),
            this.packageSets
        );
    }
}