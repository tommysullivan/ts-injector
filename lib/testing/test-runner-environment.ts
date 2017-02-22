import {ITestRunnerEnvironment} from "./i-test-runner-environment";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {IProcess} from "../node-js-wrappers/i-process";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IConsole} from "../console/i-console";
import {ITestingConfiguration} from "./i-testing-configuration";
import {IJSONValue} from "../typed-json/i-json-value";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export class TestRunnerEnvironment implements ITestRunnerEnvironment {

    constructor(
        private _testRunGUID:string,
        private process:IProcess,
        private _frameworkConfiguration:IFrameworkConfiguration,
        private fileSystem:IFileSystem,
        private testingConfiguration:ITestingConfiguration,
        private console:IConsole
    ) {}

    get jenkinsURL():string {
        return this.process.environmentVariableNamedOrDefault('BUILD_URL', null);
    }

    get user():string {
        return this.process.environmentVariableNamedOrDefault('USER', null);
    }

    get gitCloneURL():string {
        return this.process.environmentVariableNamedOrDefault('gitCloneURL', null);
    }

    get frameworkConfiguration():IFrameworkConfiguration {
        return this._frameworkConfiguration;
    }

    get gitSHA():string {
        return this.process.environmentVariableNamedOrDefault('gitSHA', null);
    }

    get packageJsonOfSystemUnderTest():IJSONSerializable {
        try {
            return this.fileSystem.readJSONObjectFileSync('./package.json');
        }
        catch(e) {
            if(this.testingConfiguration.throwErrorIfPackageJsonMissing)
                throw new Error(`Package.json could not be loaded. To suppress this error, set testing.throwErrorIfPackageJsonMissing in configuration. ${e.toString()}`);
            else {
                this.console.warn(`Package.json could not be loaded, and error was suppressed due to configuration of testing.throwErrorIfPackageJsonMissing. Error ${e.toString()}`);
                return null;
            }
        }
    }

    get testRunGUID():string {
        return this._testRunGUID;
    }


    get testName(): string {
        return this.process.environmentVariableNamedOrDefault('testName', null);
    }
}