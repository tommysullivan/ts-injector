import IList from "../collections/i-list";
import IPackage from "./i-package";

interface IRepository {
    url:string;
    packages:IList<IPackage>;
}

export default IRepository;