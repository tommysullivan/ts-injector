import {ITestingConfiguration} from "./i-testing-configuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {IProcess} from "../node-js-wrappers/i-process";
import {IPath} from "../node-js-wrappers/i-path";

export class TestingConfiguration implements ITestingConfiguration {
    constructor(
        private basePathToUseForConfiguredRelativePaths:string,
        private configJSON:IJSONObject,
        private process:IProcess,
        private path:IPath
    ) {}

    get throwErrorIfPackageJsonMissing():boolean {
        return this.process.environmentVariables.hasKey('portalId')
    }

    get frameworkOutputPath():string {
        return this.path.join(
            this.basePathToUseForConfiguredRelativePaths,
            this.configJSON.stringPropertyNamed('frameworkOutputPathRelativeToThisConfigFile')
        );
    }

    get portalUrl():string {
        return this.configJSON.jsonObjectNamed('resultServers')
            .stringPropertyNamed(this.process.environmentVariableNamed('portalId'));
    }

    get releaseUnderTest():string {
        return this.process.environmentVariableNamedOrDefault(
            'release',
            this.configJSON.stringPropertyNamed('defaultRelease')
        );
    }

    get lifecyclePhase():string {
        return this.process.environmentVariableNamedOrDefault(
            'lifecyclePhase',
            this.configJSON.stringPropertyNamed('defaultLifecyclePhase')
        );
    }

}