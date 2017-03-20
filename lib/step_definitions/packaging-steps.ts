import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {IRepositories} from "../packaging/i-repositories";
import {IPackageSets} from "../packaging/i-package-sets";
import {IRepository} from "../packaging/i-repository";
import {IList} from "../collections/i-list";
import {IPackage} from "../packaging/i-package";
import {IReleases} from "../releasing/i-releases";
import {IJSONArray} from "../typed-json/i-json-value";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    let promotionLevel:string;
    let operatingSystem:string;
    let version:string;
    let packageName:string;
    let repositories:IRepositories;
    let packageSets:IPackageSets;
    let packagesMatchingConditions:IList<IPackage>;
    let repositoryMatchingPackage:IRepository;
    let releases:IReleases;

    this.Before(function () {
        promotionLevel = undefined;
        operatingSystem = undefined;
        version = undefined;
        packageName = undefined;
        repositories = undefined;
        packageSets = undefined;
        packagesMatchingConditions = undefined;
        repositoryMatchingPackage = undefined;
        releases = undefined;
    });

    this.Given(/^I want the "([^"]*)" version of the "([^"]*)" package$/, (pVersion:string, pName:string) => {
        version = pVersion;
        packageName = pName;
    });

    this.Given(/^I want the version that was promoted to the "([^"]*)" level of the development lifecycle$/, (pLevel:string) => {
        promotionLevel = pLevel;
    });

    this.Given(/^I am using the "([^"]*)" operating system$/, (os:string) => {
        operatingSystem = os;
    });
    
    this.Given(/^I am using a packageSets collection based on the following configuration:$/, (packageSetsConfigJSONString:string) => {
        const packageSetsJSONList = $.typedJSON.newListOfJSONObjects(
            <IJSONArray> $.typedJSON.jsonParser.parse(packageSetsConfigJSONString)
        );
        packageSets = $.packaging.newPackageSetsFromJSON(packageSetsJSONList);
        $.expect(packageSets).not.to.be.null;
    });

    this.Given(/^I am using a repositories collection based on the following configuration:$/, (repositoriesConfigJSONString:string):void => {
        const repositoriesConfig = $.typedJSON.newListOfJSONObjects(
            <IJSONArray> $.typedJSON.jsonParser.parse(repositoriesConfigJSONString)
        );
        repositories = $.packaging.newRepositoriesFromJSON(repositoriesConfig, packageSets);
        $.expect(repositories).not.to.be.null;
    });

    this.Given(/^I am using the default packageSets and repositories collection$/, () => {
        repositories = $.packaging.defaultRepositories;
        packageSets = $.packaging.defaultPackageSets;
        $.expect(repositories).not.to.be.null;
        $.expect(packageSets).not.to.be.null;
    });
    
    this.Given(/^I am using the default releases collection$/, () => {
        releases = $.releasing.defaultReleases;
        $.expect(releases).not.to.be.null;
    });

    this.Given(/^I am using a releases collection based on the following configuration:$/, (releasesConfigJSONString:string):void => {
        releases = $.releasing.newReleasesFromJSON(
            $.typedJSON.newListOfJSONObjects(
                <IJSONArray> $.typedJSON.jsonParser.parse(releasesConfigJSONString)
            ),
            packageSets
        );
        $.expect(releases).not.to.be.null;
    });

    this.When(/^I ask for the packages with repository url "([^"]*)"$/, (repositoryURL:string):void => {
        packagesMatchingConditions = repositories.repositoryAtUrl(repositoryURL).packages;
    });

    this.When(/^I ask for packages for the "([^"]*)" phase of the "([^"]*)" release$/, (phaseName:string, releaseName:string):void => {
        packagesMatchingConditions = releases
            .releaseNamed(releaseName)
            .phaseNamed(phaseName)
            .packages;
    });


    this.When(/^I ask for the repository for the "([^"]*)" release$/, (releaseName:string):void => {
        repositoryMatchingPackage = repositories.repositoryHosting(
            packageName,
            version,
            promotionLevel,
            operatingSystem,
            releaseName
        );
    });

    this.When(/^I ask for the repository$/, () => {
        repositoryMatchingPackage = repositories.repositoryHosting(
            packageName,
            version,
            promotionLevel,
            operatingSystem
        );
    });


    this.Then(/^the repository has the correct url of "([^"]*)"$/, (expectedUrl:string) => {
        $.expect(repositoryMatchingPackage.url).to.equal(expectedUrl);
    });
    
    this.Then(/^package "([^"]*)" is named "([^"]*)" with version "([^"]*)", promotionLevel "([^"]*)" and operating system "([^"]*)"$/,
        (index:string, name:string, version:string, promotionLevel:string, operatingSystem:string) => {
        const item = packagesMatchingConditions.itemAt(parseInt(index));
        $.expect(item.name).to.equal(name);
        $.expect(item.version.toString()).to.equal(version);
        $.expect(item.promotionLevel.name).to.equal(promotionLevel);
        $.expect(item.supportedOperatingSystems.toArray()).to.contain(operatingSystem.toLowerCase());
    });

    this.Then(/^package "([^"]*)" is named "([^"]*)" with version "([^"]*)", promotionLevel "([^"]*)"$/, (index:string, name:string, version:string, promotionLevel:string):void => {
        const item = packagesMatchingConditions.itemAt(parseInt(index));
        $.expect(item.name).to.equal(name);
        $.expect(item.version.toString()).to.equal(version);
        $.expect(item.promotionLevel.name).to.equal(promotionLevel);
    });

};