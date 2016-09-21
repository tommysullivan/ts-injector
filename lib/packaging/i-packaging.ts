import {IPackageManager} from "./i-package-manager";
import {IRepository} from "./i-repository";
import {IList} from "../collections/i-list";
import {IPromotionLevel} from "./i-promotion-level";
import {IPackage} from "./i-package";
import {ISemanticVersion} from "./i-semantic-version";
import {IPackageSet} from "./i-package-set";
import {IRepositories} from "./i-repositories";
import {IPackageSets} from "./i-package-sets";
import {IPackageConfig} from "./i-package-config";
import {IPackageSetConfig} from "./i-package-set-config";
import {IPackageSetRefConfig} from "./i-package-set-ref-config";
import {IRepositoryConfig} from "./i-repository-config";
import {IJSONObject} from "../typed-json/i-json-object";

export interface IPackaging {
    newYumPackageManager():IPackageManager;
    newZypperPackageManager():IPackageManager;
    newAptPackageManager():IPackageManager;
    packageManagerFor(operatingSystemName:string):IPackageManager;
    newPromotionLevel(levelName:string):IPromotionLevel;
    newRepository(repositoryConfig:IRepositoryConfig, packageSets:IPackageSets):IRepository;
    newRepositories(repositoryConfigs:IList<IRepositoryConfig>, packageSets:IPackageSets):IRepositories;
    newRepositoriesFromJSON(repositoryConfigJSONs:IList<IJSONObject>, packageSets:IPackageSets):IRepositories;
    newPackage(packageConfig:IPackageConfig):IPackage;
    newPackageFromLiterals(name:string, version:string, promotionLevel:string, operatingSystems:IList<string>, tags:IList<string>):IPackage;
    newSemanticVersion(versionString:string):ISemanticVersion;
    newPackageSet(packageSetConfig:IPackageSetConfig, packageSets:IPackageSets):IPackageSet;
    newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(listOfPackageAndPackageSetRefJSONs:Array<IPackageConfig | IPackageSetRefConfig>, packageSets:IPackageSets):IList<IPackage>;
    newPackageSetsFromJSON(packageSetJSONs:IList<IJSONObject>):IPackageSets;
    newPackageSets(packageSetConfigs:IList<IPackageSetConfig>):IPackageSets;
    newPackageSetRef(packageSetRefConfig:IPackageSetRefConfig, packageSets:IPackageSets):IPackageSet;
    newPackageWithOverrides(original:IPackage, operatingSystemsOverride:IList<string>, promotionLevelOverride:IPromotionLevel, tagsOverride:IList<string>):IPackage
    defaultPackageSets:IPackageSets;
    defaultRepositories:IRepositories;
}