import {IList} from "../collections/i-list";
import {IPackage} from "./i-package";

export interface IRepository {
    url:string;
    packages:IList<IPackage>;
    isPreferredForRelease(releaseName:string):boolean;
}