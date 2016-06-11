import IOperatingSystem from "./i-operating-system";
import IJSONObject from "../typed-json/i-json-object";
import IPackageManager from "../packaging/i-package-manager";

export default class OperatingSystem implements IOperatingSystem {
    private configJSON:IJSONObject;
    private _packageManager:IPackageManager;
    private _systemInfoCommand:string;

    constructor(configJSON:IJSONObject, packageManager:IPackageManager, systemInfoCommand:string) {
        this.configJSON = configJSON;
        this._packageManager = packageManager;
        this._systemInfoCommand = systemInfoCommand;
    }

    get name():string { return this.configJSON.stringPropertyNamed('name'); }
    get version():string { return this.configJSON.stringPropertyNamed('version'); }
    get packageManager():IPackageManager { return this._packageManager; }
    get systemInfoCommand():string { return this._systemInfoCommand; }
}