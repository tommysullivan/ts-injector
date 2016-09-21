import {IPhase} from "./i-phase";
import {IList} from "../collections/i-list";
import {IPackage} from "../packaging/i-package";
import {IPackaging} from "../packaging/i-packaging";
import {IPackageSets} from "../packaging/i-package-sets";
import {IPhaseConfig} from "./i-phase-config";

export class Phase implements IPhase {
    constructor(
        private phaseConfig:IPhaseConfig,
        private packaging:IPackaging,
        private packageSets:IPackageSets
    ) {}

    get name():string {
        return this.phaseConfig.name;
    }

    packagesForOperatingSystem(operatingSystemName:string):IList<IPackage> {
        return this.packages.filter(
            p=>p.supportedOperatingSystems.contain(operatingSystemName.toLowerCase())
        );
    }

    get packages():IList<IPackage> {
        return this.packaging.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(
            this.phaseConfig.packages,
            this.packageSets
        );
    }
}