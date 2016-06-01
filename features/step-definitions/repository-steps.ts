import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
declare var $:Framework;
declare var module:any;

@steps()
export default class RepositorySteps {
    private phase:string;
    private release:string;
    private coreVersion:string;
    private operatingSystem:string;
    private repositoryUrlObtainedFromAPI:string;
    private repositoryConfigFileContent:string;
    private repositoryConfigFileLocation:string;

    @given(/^it is the "([^"]*)" phase of the development lifecycle$/)
    setPhase(phase:string):void {
        this.phase = phase;
    }

    @given(/^we are targeting the "([^"]*)" release$/)
    setRelease(release:string):void {
        this.release = release;
    }

    @given(/^the MapR Core version is "([^"]*)"$/)
    setMaprCoreVersion(coreVersion:string):void {
        this.coreVersion = coreVersion;
    }

    @given(/^we are using the "([^"]*)" family of Operating Systems$/)
    setOperatingSystem(operatingSystem:string):void {
        this.operatingSystem = operatingSystem;
    }

    @when(/^I ask for the repository url for the "([^"]*)" component family$/)
    getRepoUrlForComponentFamily(componentFamily:string):void {
        this.repositoryUrlObtainedFromAPI = $.repositories.newRepositoryUrlProvider().urlFor(
            this.phase,
            this.coreVersion,
            this.operatingSystem,
            componentFamily
        );
    }

    @then(/^I receive the appropriate repository url of "([^"]*)"$/)
    verifyRepositoryUrl(expectedUrl:string):void {
        $.expect(this.repositoryUrlObtainedFromAPI).to.equal(expectedUrl);
    }

    @when(/^I ask for the repository configuration file content for the "([^"]*)" component family$/)
    getRepoConfigFileContent(componentFamily:string):void {
        this.repositoryConfigFileContent = $.repositories.newRepositoryForOS(this.operatingSystem)
            .configFileContentFor(componentFamily, this.repositoryUrlObtainedFromAPI);
        console.log(this.repositoryConfigFileContent);
        $.expect(this.repositoryConfigFileContent).not.to.be.empty;
    }

    @then(/^it contains the url "([^"]*)"$/)
    verifyConfigFileContainsCorrectUrl(componentFamily:string):void {
        $.expect(this.repositoryConfigFileContent).to.contain(this.repositoryUrlObtainedFromAPI);
    }

    @when(/^I ask for the repository configuration file location for the "([^"]*)" component family$/)
    getRepoConfigFileLocation(componentFamily:string):void {
        this.repositoryConfigFileLocation = $.repositories.newRepositoryForOS(this.operatingSystem)
            .configFileLocationFor(componentFamily);
        console.log(this.repositoryConfigFileLocation);
        $.expect(this.repositoryConfigFileLocation).not.to.be.empty;
    }

    @then(/^it contains a valid filename$/)
    verifyConfigFilelocationIsValidFileName():void {
        $.expect(this.repositoryConfigFileLocation).not.to.contain(' ');
    }
}
module.exports = RepositorySteps;