import IPhase from "./i-phase";
import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import IPackage from "../packaging/i-package";
import IPackaging from "../packaging/i-packaging";
import IPackageSets from "../packaging/i-package-sets";

export default class Phase implements IPhase {
    private configJSON:IJSONObject;
    private packaging:IPackaging;
    private packageSets:IPackageSets;

    constructor(configJSON:IJSONObject, packaging:IPackaging, packageSets:IPackageSets) {
        this.configJSON = configJSON;
        this.packaging = packaging;
        this.packageSets = packageSets;
    }

    get name():string { return this.configJSON.stringPropertyNamed('name'); }

    packagesForOperatingSystem(operatingSystemName:string):IList<IPackage> {
        return this.packages.filter(
            p=>p.supportedOperatingSystems.contain(operatingSystemName.toLowerCase())
        );
    }

    get packages():IList<IPackage> {
        return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(
            this.configJSON.listOfJSONObjectsNamed('packages'),
            this.packageSets
        );
    }
}