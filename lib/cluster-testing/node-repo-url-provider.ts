import INodeRepoURLProvider from "./i-node-repo-url-provider";
import IRepositoryUrlProvider from "../repositories/i-repository-url-provider";

export default class NodeRepoUrlProvider implements INodeRepoURLProvider {
    private repoUrlProvider:IRepositoryUrlProvider;
    private phase:string;
    private coreVersion:string;

    constructor(repoUrlProvider:IRepositoryUrlProvider, phase:string, coreVersion:string) {
        this.repoUrlProvider = repoUrlProvider;
        this.phase = phase;
        this.coreVersion = coreVersion;
    }

    urlFor(operatingSystemName:string, componentFamilyName:string):string {
        return this.repoUrlProvider.urlFor(this.phase, this.coreVersion, operatingSystemName, componentFamilyName);
    }
}