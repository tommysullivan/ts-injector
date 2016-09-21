import {ISemanticVersion} from "./i-semantic-version";

export class SemanticVersion implements ISemanticVersion {
    private _versionString:string;

    constructor(versionString:string) {
        this._versionString = versionString;
    }

    matches(versionString:string):boolean {
        return this._versionString == versionString;
    }

    toString():string {
        return this._versionString;
    }

}