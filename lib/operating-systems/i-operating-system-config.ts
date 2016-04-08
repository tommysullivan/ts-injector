import IRepository from "../repositories/i-repository";

interface IOperatingSystemConfig {
    name:string;
    version:string;
    repository:IRepository;
}

export default IOperatingSystemConfig;