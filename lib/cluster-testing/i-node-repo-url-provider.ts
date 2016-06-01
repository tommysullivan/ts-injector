interface INodeRepoURLProvider {
    urlFor(operatingSystemName:string, componentFamilyName:string):string;
}
export default INodeRepoURLProvider;