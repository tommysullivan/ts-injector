import {IReleases} from "./i-releases";
import {IList} from "../collections/i-list";
import {IRelease} from "./i-release";
import {IPhase} from "./i-phase";
import {IPackageSets} from "../packaging/i-package-sets";
import {IReleaseConfig} from "./i-release-config";
import {IPhaseConfig} from "./i-phase-config";
import {IJSONObject} from "../typed-json/i-json-object";
;
export interface IReleasing {
    newReleasesFromJSON(listOfReleaseJSONs:IList<IJSONObject>, packageSets:IPackageSets):IReleases;
    newReleases(listOfReleaseJSONs:IList<IReleaseConfig>, packageSets:IPackageSets):IReleases;
    newRelease(releaseJSON:IReleaseConfig, packageSets:IPackageSets):IRelease;
    newPhase(phaseConfig:IPhaseConfig, packageSets:IPackageSets):IPhase;
    defaultReleases:IReleases;
}