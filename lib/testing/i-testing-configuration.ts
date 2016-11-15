export interface ITestingConfiguration {
    throwErrorIfPackageJsonMissing:boolean;
    frameworkOutputPath:string;
    portalUrl:string;
    releaseUnderTest:string;
    lifecyclePhase:string;
}