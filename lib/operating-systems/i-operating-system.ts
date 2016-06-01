import IRepository from "../repositories/i-repository";

interface IOperatingSystem {
    name:string;
    version:string;
    repository:IRepository;
    systemInfoCommand:string;
}

export default IOperatingSystem;