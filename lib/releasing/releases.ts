import IReleases from "./i-releases";
import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";
import IRelease from "./i-release";
import IReleasing from "./i-releasing";
import IPackageSets from "../packaging/i-package-sets";

export default class Releases implements IReleases {
    private releasing:IReleasing;
    private listOfReleaseJSONs:IList<IJSONObject>;
    private packageSets:IPackageSets;

    constructor(releasing:IReleasing, listOfReleaseJSONs:IList<IJSONObject>, packageSets:IPackageSets) {
        this.releasing = releasing;
        this.listOfReleaseJSONs = listOfReleaseJSONs;
        this.packageSets = packageSets;
    }

    releaseNamed(releaseName:string):IRelease {
        return this.all.firstWhere(r=>r.name==releaseName);
    }
    
    get all():IList<IRelease> {
        return this.listOfReleaseJSONs.map(
            releaseJSON=>this.releasing.newRelease(releaseJSON, this.packageSets)
        );
    }
}