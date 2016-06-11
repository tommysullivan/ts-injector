import IRepository from "./i-repository";

interface IConfigFileContent {
    clientConfigurationFileContentFor(repository:IRepository, descriptiveName:string):string;
}

export default IConfigFileContent;