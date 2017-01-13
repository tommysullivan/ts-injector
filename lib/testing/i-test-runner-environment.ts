import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface ITestRunnerEnvironment {
    jenkinsURL:string,
    user:string,
    gitCloneURL:string,
    frameworkConfiguration:IFrameworkConfiguration,
    gitSHA:string,
    packageJsonOfSystemUnderTest:IJSONSerializable,
    testRunGUID:string
}