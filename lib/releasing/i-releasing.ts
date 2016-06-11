import IJSONObject from "../typed-json/i-json-object";
import IReleases from "./i-releases";
import IList from "../collections/i-list";
import IRelease from "./i-release";
import IPhase from "./i-phase";
import IPackageSets from "../packaging/i-package-sets";
;
interface IReleasing {
    newReleases(listOfReleaseJSONs:IList<IJSONObject>, packageSets:IPackageSets):IReleases;
    newRelease(releaseJSON:IJSONObject, packageSets:IPackageSets):IRelease;
    newPhase(phaseJSON:IJSONObject, packageSets:IPackageSets):IPhase;
    defaultReleases:IReleases;
}
export default IReleasing;