import IRepository from "./i-repository";
import IConfigFileContent from "./i-config-file-content";

export default class YumConfigFileContent implements IConfigFileContent {
    clientConfigurationFileContentFor(repository:IRepository, descriptiveName:string):string {
        return [
            `[${descriptiveName}]`,
            `name = ${descriptiveName}`,
            `enabled = 1`,
            `baseurl = ${repository.url}`,
            `protected = 1`,
            `gpgcheck = 0`
        ].join("\n");
    }
}