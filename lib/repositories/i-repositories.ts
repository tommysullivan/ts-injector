import IRepositoryUrlProvider from "./i-repository-url-provider";
import IRepository from "./i-repository";

interface IRepositories {
    newYumRepository():IRepository;
    newZypperRepository():IRepository;
    newAptRepository():IRepository;
    newRepositoryForOS(operatingSystemName:string):IRepository;
    newRepositoryUrlProvider():IRepositoryUrlProvider;
}
export default IRepositories;