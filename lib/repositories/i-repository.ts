interface IRepository {
    type:string;
    host:string;
    packageCommand:string;
    repoListCommand:string;
    packageListCommand:string;
    urlFor(componentFamily:string):string;
}

export default IRepository;