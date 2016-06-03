import YumPackageManager from "./yum-package-manager";
import ZypperPackageManager from "./zypper-package-manager";
import AptPackageManager from "./apt-package-manager";
import ITypedJSON from "../typed-json/i-typed-json";
import IPackaging from "./i-packaging";
import IPackageManager from "./i-package-manager";
import IConfigFileContent from "./i-config-file-content";
import YumConfigFileContent from "./yum-config-file-content";
import IJSONObject from "../typed-json/i-json-object";
import Repository from "./repository";
import IRepository from "./i-repository";
import IList from "../collections/i-list";
import IPackage from "./i-package";
import Package from "./package";
import IPromotionLevel from "./i-promotion-level";
import ISemanticVersion from "./i-semantic-version";
import PromotionLevel from "./promotion-level";
import SemanticVersion from "./semantic-version";
import IPackageSet from "./i-package-set";
import PackageSet from "./package-set";
import ICollections from "../collections/i-collections";
import IRepositories from "./i-repositories";
import Repositories from "./repositories";
import IPackageSets from "./i-package-sets";
import PackageSets from "./package-sets";
import PackageFromLiterals from "./package-from-literals";
import PackageSetReference from "./package-set-reference";
import PackageWithOverrides from "./package-with-overrides";
import PackageComparer from "./package-comparer";

export default class Packaging implements IPackaging {
    private typedJson:ITypedJSON;
    private configJSON:IJSONObject;
    private collections:ICollections;

    constructor(typedJson:ITypedJSON, configJSON:IJSONObject, collections:ICollections) {
        this.typedJson = typedJson;
        this.configJSON = configJSON;
        this.collections = collections;
    }

    packageManagerFor(operatingSystemName:string):IPackageManager {
        switch(operatingSystemName.toLowerCase()) {
            case 'centos': case 'redhat': return this.newYumPackageManager();
            case 'ubuntu': return this.newAptPackageManager();
            case 'suse': return this.newZypperPackageManager();
            default: throw new Error(`cannot create repository for OS "${operatingSystemName}`);
        }
    }

    newYumConfigFileContent():IConfigFileContent {
        return new YumConfigFileContent();
    }

    newYumPackageManager():IPackageManager {
        return new YumPackageManager(this.newYumConfigFileContent());
    }

    newZypperPackageManager():IPackageManager {
        return new ZypperPackageManager(this.newYumConfigFileContent());
    }

    newAptPackageManager():IPackageManager {
        return new AptPackageManager();
    }
    
    newPromotionLevel(levelName:string):IPromotionLevel {
        return new PromotionLevel(levelName);
    }

    newRepository(configJSON:IJSONObject, packageSets:IPackageSets):IRepository {
        return new Repository(configJSON, this, packageSets);
    }

    newRepositories(repositoriesJSONList:IList<IJSONObject>, packageSets:IPackageSets):IRepositories {
        return new Repositories(repositoriesJSONList, this, packageSets);
    }

    newPackage(packageJSON:IJSONObject):IPackage{
        return new Package(packageJSON, this, this.newPackageComparer());
    }

    newPackageComparer():PackageComparer {
        return new PackageComparer();
    }

    newSemanticVersion(versionString:string):ISemanticVersion {
        return new SemanticVersion(versionString);
    }

    newPackageSet(packageSetConfig:IJSONObject, packageSets:IPackageSets):IPackageSet {
        return new PackageSet(packageSetConfig, this, packageSets);
    }
    
    newPackageSets(listOfPackageSetConfigJSONs:IList<IJSONObject>):IPackageSets {
        return new PackageSets(listOfPackageSetConfigJSONs, this);
    }

    newPackageFromLiterals(name:string, version:string, promotionLevel:string, operatingSystems:IList<string>, tags:IList<string>):IPackage {
        return new PackageFromLiterals(
            name,
            this.newSemanticVersion(version),
            this.newPromotionLevel(promotionLevel),
            operatingSystems,
            this.newPackageComparer(),
            tags
        );
    }

    newPackageSetRef(configJSON:IJSONObject, packageSets:IPackageSets):IPackageSet {
        return new PackageSetReference(configJSON, this, packageSets);
    }
    
    newPackageWithOverrides(original:IPackage, operatingSystemsOverride:IList<string>, promotionLevelOverride:IPromotionLevel, tagsOverride:IList<string>):IPackage {
        return new PackageWithOverrides(
            original,
            operatingSystemsOverride,
            promotionLevelOverride,
            this.newPackageComparer(),
            tagsOverride
        );
    }

    newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(listOfPackageAndPackageSetRefJSONs:IList<IJSONObject>, packageSets:IPackageSets):IList<IPackage> {
        return listOfPackageAndPackageSetRefJSONs.flatMap(
            packageJSON => packageJSON.hasPropertyNamed('packageSetRef')
                ? this.newPackageSetRef(packageJSON, packageSets).packages
                : this.collections.newList([this.newPackage(packageJSON)])
        );
    }

    get defaultPackageSets():IPackageSets {
        return this.newPackageSets(
            this.configJSON.listOfJSONObjectsNamed('packageSets')
        );
    }

    get defaultRepositories():IRepositories {
        return this.newRepositories(
            this.configJSON.listOfJSONObjectsNamed('repositories'),
            this.defaultPackageSets
        );
    }
}