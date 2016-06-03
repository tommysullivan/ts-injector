import IPackageManager from "./i-package-manager";
import IJSONObject from "../typed-json/i-json-object";
import IRepository from "./i-repository";
import IList from "../collections/i-list";
import IPromotionLevel from "./i-promotion-level";
import IPackage from "./i-package";
import ISemanticVersion from "./i-semantic-version";
import IPackageSet from "./i-package-set";
import IRepositories from "./i-repositories";
import IPackageSets from "./i-package-sets";

interface IPackaging {
    newYumPackageManager():IPackageManager;
    newZypperPackageManager():IPackageManager;
    newAptPackageManager():IPackageManager;
    packageManagerFor(operatingSystemName:string):IPackageManager;
    newPromotionLevel(levelName:string):IPromotionLevel;
    newRepository(configJSON:IJSONObject, packageSets:IPackageSets):IRepository;
    newRepositories(listOfRepoJSONs:IList<IJSONObject>, packageSets:IPackageSets):IRepositories;
    newPackage(packageJSON:IJSONObject):IPackage;
    newPackageFromLiterals(name:string, version:string, promotionLevel:string, operatingSystems:IList<string>, tags:IList<string>):IPackage;
    newSemanticVersion(versionString:string):ISemanticVersion;
    newPackageSet(packageSetConfigJSON:IJSONObject, packageSets:IPackageSets):IPackageSet;
    newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(listOfPackageAndPackageSetRefJSONs:IList<IJSONObject>, packageSets:IPackageSets):IList<IPackage>;
    newPackageSets(listOfPackageSetConfigJSONs:IList<IJSONObject>):IPackageSets;
    newPackageSetRef(configJSON:IJSONObject, packageSets:IPackageSets):IPackageSet;
    newPackageWithOverrides(original:IPackage, operatingSystemsOverride:IList<string>, promotionLevelOverride:IPromotionLevel, tagsOverride:IList<string>):IPackage
    defaultPackageSets:IPackageSets;
    defaultRepositories:IRepositories;
}
export default IPackaging;