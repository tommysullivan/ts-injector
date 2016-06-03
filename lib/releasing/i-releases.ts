import IRelease from "./i-release";
import IList from "../collections/i-list";

interface IReleases {
    releaseNamed(releaseName:string):IRelease;
    all:IList<IRelease>;
}

export default IReleases;