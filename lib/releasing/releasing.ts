import IRelease from "./i-release";
import IReleases from "./i-releases";
import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import Release from "./release";
import Releases from "./releases";
import IReleasing from "./i-releasing";
import IPhase from "./i-phase";
import Phase from "./phase";
import IPackaging from "../packaging/i-packaging";
import IPackageSets from "../packaging/i-package-sets";

export default class Releasing implements IReleasing {
    private packaging:IPackaging;
    private configJSON:IJSONObject;

    constructor(packaging:IPackaging, configJSON:IJSONObject) {
        this.packaging = packaging;
        this.configJSON = configJSON;
    }

    newReleases(listOfReleasesJSONObjects:IList<IJSONObject>, packageSets:IPackageSets):IReleases {
        return new Releases(this, listOfReleasesJSONObjects, packageSets);
    }

    newRelease(configJSON:IJSONObject, packageSets:IPackageSets):IRelease {
        return new Release(configJSON, this, packageSets);
    }

    newPhase(phaseJSON:IJSONObject, packageSets:IPackageSets):IPhase {
        return new Phase(phaseJSON, this.packaging, packageSets);
    }

    get defaultReleases():IReleases {
        return this.newReleases(this.configJSON.listOfJSONObjectsNamed('releases'), this.packaging.defaultPackageSets);
    }
}