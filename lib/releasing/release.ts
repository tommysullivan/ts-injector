import {IRelease} from "./i-release";
import {IPhase} from "./i-phase";
import {IReleasing} from "./i-releasing";
import {IList} from "../collections/i-list";
import {IPackageSets} from "../packaging/i-package-sets";
import {IReleaseConfig} from "./i-release-config";
import {ICollections} from "../collections/i-collections";

export class Release implements IRelease {
    constructor(
        private releaseConfig:IReleaseConfig,
        private releasing:IReleasing,
        private packageSets:IPackageSets,
        private collections:ICollections
    ) {}

    get name():string {
        return this.releaseConfig.name;
    }

    get phases():IList<IPhase> {
        return this.collections.newList(
            this.releaseConfig.phases.map(
                phaseConfig => this.releasing.newPhase(phaseConfig, this.packageSets)
            )
        );
    }
    
    phaseNamed(name:string):IPhase {
        return this.phases.firstWhere(r=>r.name==name);
    }

}