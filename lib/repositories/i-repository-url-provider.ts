interface IRepositoryUrlProvider {
    urlFor(phase:string, coreVersion:string, operatingSystemName:string, componentFamilyName:string):string;
}
export default IRepositoryUrlProvider;