import {IReleases} from "./i-releases";
import {IList} from "../collections/i-list";
import {IRelease} from "./i-release";
import {IReleasing} from "./i-releasing";
import {IPackageSets} from "../packaging/i-package-sets";
import {IReleaseConfig} from "./i-release-config";

export class Releases implements IReleases {
    constructor(
        private releasing:IReleasing,
        private releaseConfigs:IList<IReleaseConfig>,
        private packageSets:IPackageSets
    ) {}

    releaseNamed(releaseName:string):IRelease {
        return this.all.firstWhere(r=>r.name==releaseName);
    }
    
    get all():IList<IRelease> {
        return this.releaseConfigs.map(
            releaseConfig=>this.releasing.newRelease(releaseConfig, this.packageSets)
        );
    }
}