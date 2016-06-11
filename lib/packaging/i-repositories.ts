import IRepository from "./i-repository";
import IList from "../collections/i-list";
import IPackage from "./i-package";

interface IRepositories {
    all:IList<IRepository>;
    repositoryAtUrl(url:string):IRepository;
    repositoryHosting(packageName:string, version:string, promotionLevel:string, operatingSystem:string);
}
export default IRepositories;