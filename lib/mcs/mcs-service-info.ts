import IJSONObject from "../typed-json/i-json-object";

export default class MCSServiceInfo {
    private _name:string;
    private statusJSON:IJSONObject;

    constructor(name:string, statusJSON:IJSONObject) {
        this._name = name;
        this.statusJSON = statusJSON;
    }

    get name():string {
        return this._name;
    }

    get isHealthy():boolean {
        const total = this.statusJSON.numericPropertyNamed('total');
        const numOnStandby = this.statusJSON.hasPropertyNamed('standby')
            ? this.statusJSON.numericPropertyNamed('standby')
            : 0;
        return total > 0
            && this.statusJSON.numericPropertyNamed('failed') === 0
            && this.statusJSON.numericPropertyNamed('stopped') === 0
            && this.statusJSON.numericPropertyNamed('active') + numOnStandby == total;
    }
}