import {IPackageSets} from "./i-package-sets";
import {IList} from "../collections/i-list";
import {IPackaging} from "./i-packaging";
import {IPackageSet} from "./i-package-set";
import {ISemanticVersion} from "./i-semantic-version";
import {IPackageSetConfig} from "./i-package-set-config";

export class PackageSets implements IPackageSets {
    constructor(
        private packageSetConfigs:IList<IPackageSetConfig>,
        private packaging:IPackaging
    ) {}

    setWithIdAndVersion(soughtId:string, version:ISemanticVersion):IPackageSet {
        return this.all.firstWhere(p=>p.id==soughtId && p.version.matches(version.toString()));
    }

    get all():IList<IPackageSet> {
        return this.packageSetConfigs.map(
            packageSetConfig=>this.packaging.newPackageSet(packageSetConfig, this)
        );
    }
}