import {ICucumberRunConfiguration} from "./i-cucumber-run-configuration";
import {IDictionary} from "../collections/i-dictionary";
import {IHash} from "../collections/i-hash";
import {IJSONValue} from "../typed-json/i-json-value";

export class CucumberRunConfiguration implements ICucumberRunConfiguration {
    private _environmentVariables:IDictionary<string>;
    private _cucumberAdditionalArgs:string;
    private _isDryRun:boolean;
    private _cucumberExecutablePath:string;
    private _jsonResultFilePath:string;

    constructor(environmentVariables:IDictionary<string>, cucumberAdditionalArgs:string, isDryRun:boolean, cucumberExecutablePath:string, jsonResultFilePath:string) {
        this._environmentVariables = environmentVariables;
        this._cucumberAdditionalArgs = cucumberAdditionalArgs;
        this._isDryRun = isDryRun;
        this._cucumberExecutablePath = cucumberExecutablePath;
        this._jsonResultFilePath = jsonResultFilePath;
    }

    get environmentVariables():IHash<string> {
        return <IHash<string>> this._environmentVariables.toJSON();
    }

    get jsonResultFilePath():string {
        return this._jsonResultFilePath;
    }

    get cucumberAdditionalArgs():string {
        return this._cucumberAdditionalArgs;
    }

    get isDryRun():boolean {
        return this._isDryRun;
    }

    toJSON():IJSONValue {
        return {
            environmentVariables: this.environmentVariables,
            jsonResultFilePath: this.jsonResultFilePath,
            cucumberAdditionalArgs: this.cucumberAdditionalArgs
        }
    }
}