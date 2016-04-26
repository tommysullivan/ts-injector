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
        var total = this.statusJSON.numericPropertyNamed('total');
        return total > 0
            && this.statusJSON.numericPropertyNamed('failed') === 0
            && this.statusJSON.numericPropertyNamed('stopped') === 0
            && this.statusJSON.numericPropertyNamed('active') == total;
    }
}