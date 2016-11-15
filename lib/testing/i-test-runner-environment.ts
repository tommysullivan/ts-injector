import {IFrameworkConfiguration} from "../framework/i-framework-configuration";

export interface ITestRunnerEnvironment {
    jenkinsURL:string,
    user:string,
    gitCloneURL:string,
    frameworkConfiguration:IFrameworkConfiguration,
    gitSHA:string,
    packageJsonOfSystemUnderTest:any,
    testRunGUID:string
}