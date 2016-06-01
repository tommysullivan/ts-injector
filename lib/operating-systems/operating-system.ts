import IOperatingSystem from "./i-operating-system";
import IJSONObject from "../typed-json/i-json-object";
import IRepository from "../repositories/i-repository";

export default class OperatingSystem implements IOperatingSystem {
    private configJSON:IJSONObject;
    private _repository:IRepository;
    private _systemInfoCommand:string;

    constructor(configJSON:IJSONObject, repository:IRepository, systemInfoCommand:string) {
        this.configJSON = configJSON;
        this._repository = repository;
        this._systemInfoCommand = systemInfoCommand;
    }

    get name():string { return this.configJSON.stringPropertyNamed('name'); }
    get version():string { return this.configJSON.stringPropertyNamed('version'); }
    get repository():IRepository { return this._repository; }
    get systemInfoCommand():string { return this._systemInfoCommand; }
}