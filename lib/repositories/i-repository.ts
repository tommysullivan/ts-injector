interface IRepository {
    type:string;
    host:string;
    packageCommand:string;
    repoListCommand:string;
    packageListCommand:string;
    packageUpdateCommand:string;
    urlFor(componentFamily:string):string;
}

export default IRepository;