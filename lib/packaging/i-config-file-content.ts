import {IRepository} from "./i-repository";

export interface IConfigFileContent {
    clientConfigurationFileContentFor(repository:IRepository, descriptiveName:string, tagName:string):string;
}