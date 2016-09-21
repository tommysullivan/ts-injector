import {IRepository} from "./i-repository";
import {IList} from "../collections/i-list";

export interface IRepositories {
    all:IList<IRepository>;
    repositoryAtUrl(url:string):IRepository;
    repositoryHosting(packageName:string, version:string, promotionLevel:string, operatingSystem:string);
}