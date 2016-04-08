import ICucumberRunConfiguration from "./i-cucumber-run-configuration";
import IDictionary from "../collections/i-dictionary";

export default class CucumberRunConfiguration implements ICucumberRunConfiguration {
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

    environmentVariables():IDictionary<string> {
        return this._environmentVariables;
    }

    jsonResultFilePath():string {
        return this._jsonResultFilePath;
    }

    cucumberAdditionalArgs():string {
        return this._cucumberAdditionalArgs;
    }

    isDryRun():boolean {
        return this._isDryRun;
    }

    toJSON():any {
        return {
            environmentVariables: this.environmentVariables().toJSON(),
            jsonResultFilePath: this.jsonResultFilePath(),
            cucumberAdditionalArgs: this.cucumberAdditionalArgs()
        }
    }
}