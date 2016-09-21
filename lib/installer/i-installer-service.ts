import {IList} from "../collections/i-list";
import {IFuture} from "../promise/i-future";

export interface IInstallerService {
    name:string;
    version:string;
    hostNames():IFuture<IList<string>>;
}