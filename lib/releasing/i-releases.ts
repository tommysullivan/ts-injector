import {IRelease} from "./i-release";
import {IList} from "../collections/i-list";

export interface IReleases {
    releaseNamed(releaseName:string):IRelease;
    all:IList<IRelease>;
}