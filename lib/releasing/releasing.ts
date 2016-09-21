import {IRelease} from "./i-release";
import {IReleases} from "./i-releases";
import {IList} from "../collections/i-list";
import {Release} from "./release";
import {Releases} from "./releases";
import {IReleasing} from "./i-releasing";
import {IPhase} from "./i-phase";
import {Phase} from "./phase";
import {IPackaging} from "../packaging/i-packaging";
import {IPackageSets} from "../packaging/i-package-sets";
import {IReleasingConfig} from "./i-releasing-config";
import {IReleaseConfig} from "./i-release-config";
import {IPhaseConfig} from "./i-phase-config";
import {ICollections} from "../collections/i-collections";
import {ReleaseConfig} from "./release-config";
import {IJSONObject} from "../typed-json/i-json-object";

export class Releasing implements IReleasing {
    constructor(
        private packaging:IPackaging,
        private config:IReleasingConfig,
        private collections:ICollections
    ) {}

    newReleases(releaseConfigs:IList<IReleaseConfig>, packageSets:IPackageSets):IReleases {
        return new Releases(this, releaseConfigs, packageSets);
    }

    newReleasesFromJSON(listOfReleaseJSONs:IList<IJSONObject>, packageSets:IPackageSets):IReleases {
        return this.newReleases(listOfReleaseJSONs.map(r=>new ReleaseConfig(r)), packageSets);
    }

    newRelease(releaseConfig:IReleaseConfig, packageSets:IPackageSets):IRelease {
        return new Release(releaseConfig, this, packageSets, this.collections);
    }

    newPhase(phaseConfig:IPhaseConfig, packageSets:IPackageSets):IPhase {
        return new Phase(phaseConfig , this.packaging, packageSets);
    }

    get defaultReleases():IReleases {
        return this.newReleases(
            this.collections.newList(this.config.releases),
            this.packaging.defaultPackageSets
        );
    }
}