import { binding as steps, given, when, then } from "cucumber-tsflow";
import {Framework} from "../framework/framework";
import {IRepositories} from "../packaging/i-repositories";
import {IPackageSets} from "../packaging/i-package-sets";
import {IRepository} from "../packaging/i-repository";
import {IList} from "../collections/i-list";
import {IPackage} from "../packaging/i-package";
import {IReleases} from "../releasing/i-releases";

declare const $:Framework;
declare const module:any;

@steps()
export class PackagingSteps {
    private promotionLevel:string;
    private operatingSystem:string;
    private version:string;
    private packageName:string;
    private repositories:IRepositories;
    private packageSets:IPackageSets;
    private packagesMatchingConditions:IList<IPackage>;
    private repositoryMatchingPackage:IRepository;
    private releases:IReleases;

    @given(/^I want the "([^"]*)" version of the "([^"]*)" package$/)
    setVersionAndNameOfDesiredPackage(version:string, packageName:string):void {
        this.version = version;
        this.packageName = packageName;
    }

    @given(/^I want the version that was promoted to the "([^"]*)" level of the development lifecycle$/)
    setPromotionLevel(promotionLevel:string):void {
        this.promotionLevel = promotionLevel;
    }

    @given(/^I am using the "([^"]*)" operating system$/)
    setOperatingSystem(operatingSystem:string):void {
        this.operatingSystem = operatingSystem;
    }
    
    @given(/^I am using a packageSets collection based on the following configuration:$/)
    createPackagSetsCollectionBasedOnConfig(packageSetsConfigJSONString:string):void {
        const packageSetsJSONList = $.typedJSON.newListOfJSONObjects(JSON.parse(packageSetsConfigJSONString));
        this.packageSets = $.packaging.newPackageSetsFromJSON(packageSetsJSONList);
        $.expect(this.packageSets).not.to.be.null;
    }

    @given(/^I am using a repositories collection based on the following configuration:$/)
    createRepositoriesCollectionBasedOnConfig(repositoriesConfigJSONString:string):void {
        const repositoriesConfig = $.typedJSON.newListOfJSONObjects(JSON.parse(repositoriesConfigJSONString));
        this.repositories = $.packaging.newRepositoriesFromJSON(repositoriesConfig, this.packageSets);
        $.expect(this.repositories).not.to.be.null;
    }

    @given(/^I am using the default packageSets and repositories collection$/)
    useDefaultPackageSetsAndRepositories():void {
        this.repositories = $.packaging.defaultRepositories;
        this.packageSets = $.packaging.defaultPackageSets;
        $.expect(this.repositories).not.to.be.null;
        $.expect(this.packageSets).not.to.be.null;
    }
    
    @given(/^I am using the default releases collection$/)
    useDefaultReleasesCollection():void {
        this.releases = $.releasing.defaultReleases;
        $.expect(this.releases).not.to.be.null;
    }

    @given(/^I am using a releases collection based on the following configuration:$/)
    createReleasesCollectionBasedOnConfig(releasesConfigJSONString:string):void {
        this.releases = $.releasing.newReleasesFromJSON(
            $.typedJSON.newListOfJSONObjects(JSON.parse(releasesConfigJSONString)),
            this.packageSets
        );
        $.expect(this.releases).not.to.be.null;
    }

    @when(/^I ask for the packages with repository url "([^"]*)"$/)
    getJSONRepresentationOfPackagesInRepoLocatedAt(repositoryURL:string):void {
        this.packagesMatchingConditions = this.repositories.repositoryAtUrl(repositoryURL).packages;
    }

    @when(/^I ask for packages for the "([^"]*)" phase of the "([^"]*)" release$/)
    getPackagesForPhaseAndRelease(phaseName:string, releaseName:string):void {
        this.packagesMatchingConditions = this.releases
            .releaseNamed(releaseName)
            .phaseNamed(phaseName)
            .packages;
    }


    @when(/^I ask for the repository for the "([^"]*)" release$/)
    public getRepository(releaseName:string): void {
        this.repositoryMatchingPackage = this.repositories.repositoryHosting(
            this.packageName,
            this.version,
            this.promotionLevel,
            this.operatingSystem,
            releaseName
        );
    }


    @then(/^the repository has the correct url of "([^"]*)"$/)
    verifyRepositoryUrl(expectedUrl:string):void {
        $.expect(this.repositoryMatchingPackage.url).to.equal(expectedUrl);
    }
    
    @then(/^package "([^"]*)" is named "([^"]*)" with version "([^"]*)", promotionLevel "([^"]*)" and operating system "([^"]*)"$/)
    verifyMatchingPackagesHaveCorrectInfo(index:string, name:string, version:string, promotionLevel:string, operatingSystem:string):void {
        const item = this.packagesMatchingConditions.itemAt(parseInt(index));
        $.expect(item.name).to.equal(name);
        $.expect(item.version.toString()).to.equal(version);
        $.expect(item.promotionLevel.name).to.equal(promotionLevel);
        $.expect(item.supportedOperatingSystems.toArray()).to.contain(operatingSystem.toLowerCase());
    }

    @then(/^package "([^"]*)" is named "([^"]*)" with version "([^"]*)", promotionLevel "([^"]*)"$/)
    verifyPackageNameVersionAndPromoLevel(index:string, name:string, version:string, promotionLevel:string):void {
        const item = this.packagesMatchingConditions.itemAt(parseInt(index));
        $.expect(item.name).to.equal(name);
        $.expect(item.version.toString()).to.equal(version);
        $.expect(item.promotionLevel.name).to.equal(promotionLevel);
    }

}
module.exports = PackagingSteps;