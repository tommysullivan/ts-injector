import {YumPackageManager} from "./yum-package-manager";
import {ZypperPackageManager} from "./zypper-package-manager";
import {AptPackageManager} from "./apt-package-manager";
import {IPackaging} from "./i-packaging";
import {IPackageManager} from "./i-package-manager";
import {IConfigFileContent} from "./i-config-file-content";
import {YumConfigFileContent} from "./yum-config-file-content";
import {Repository} from "./repository";
import {IRepository} from "./i-repository";
import {IList} from "../collections/i-list";
import {IPackage} from "./i-package";
import {Package} from "./package";
import {IPromotionLevel} from "./i-promotion-level";
import {ISemanticVersion} from "./i-semantic-version";
import {PromotionLevel} from "./promotion-level";
import {SemanticVersion} from "./semantic-version";
import {IPackageSet} from "./i-package-set";
import {PackageSet} from "./package-set";
import {ICollections} from "../collections/i-collections";
import {IRepositories} from "./i-repositories";
import {Repositories} from "./repositories";
import {IPackageSets} from "./i-package-sets";
import {PackageSets} from "./package-sets";
import {PackageFromLiterals} from "./package-from-literals";
import {PackageSetReference} from "./package-set-reference";
import {PackageWithOverrides} from "./package-with-overrides";
import {PackageComparer} from "./package-comparer";
import {IPackagingConfig} from "./i-packaging-config";
import {IPackageConfig} from "./i-package-config";
import {IPackageSetRefConfig} from "./i-package-set-ref-config";
import {IPackageSetConfig} from "./i-package-set-config";
import {IRepositoryConfig} from "./i-repository-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {PackageSetConfig} from "./package-set-config";
import {RepositoryConfig} from "./repository-config";

export class Packaging implements IPackaging {
    constructor(
        private packagingConfig:IPackagingConfig,
        private collections:ICollections
    ) {}

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

    newRepository(repositoryConfig:IRepositoryConfig, packageSets:IPackageSets):IRepository {
        return new Repository(repositoryConfig, this, packageSets, this.collections);
    }

    newRepositories(repositoriesJSONList:IList<IRepositoryConfig>, packageSets:IPackageSets):IRepositories {
        return new Repositories(repositoriesJSONList, this, packageSets);
    }

    newRepositoriesFromJSON(repositoryConfigJSONs:IList<IJSONObject>, packageSets:IPackageSets):IRepositories {
        return this.newRepositories(repositoryConfigJSONs.map(r=>new RepositoryConfig(r)), packageSets);
    }

    newPackage(packageConfig:IPackageConfig):IPackage{
        return new Package(
            packageConfig,
            this,
            this.newPackageComparer(),
            this.collections
        );
    }

    newPackageComparer():PackageComparer {
        return new PackageComparer();
    }

    newSemanticVersion(versionString:string):ISemanticVersion {
        return new SemanticVersion(versionString);
    }

    newPackageSet(packageSetConfig:IPackageSetConfig, packageSets:IPackageSets):IPackageSet {
        return new PackageSet(packageSetConfig, this, packageSets);
    }
    
    newPackageSets(packageSetConfigs:IList<IPackageSetConfig>):IPackageSets {
        return new PackageSets(packageSetConfigs, this);
    }

    newPackageSetsFromJSON(packageSetJSONs:IList<IJSONObject>):IPackageSets {
        return this.newPackageSets(packageSetJSONs.map(p=>new PackageSetConfig(p)));
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

    newPackageSetRef(packageSetRefConfig:IPackageSetRefConfig, packageSets:IPackageSets):IPackageSet {
        return new PackageSetReference(
            packageSetRefConfig,
            this,
            packageSets,
            this.collections
        );
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

    newListOfPackagesFromJSONListOfPackageAndPackageSetRefs(listOfPackageConfigs:Array<IPackageConfig | IPackageSetRefConfig>, packageSets:IPackageSets):IList<IPackage> {
        return this.collections.newList<IPackageConfig | IPackageSetRefConfig>(listOfPackageConfigs)
            .flatMap(
                packageConfig => (<IPackageSetRefConfig> packageConfig).packageSetRef
                    ? this.newPackageSetRef((<IPackageSetRefConfig> packageConfig), packageSets).packages
                    : this.collections.newList([this.newPackage(<IPackageConfig> packageConfig)])
            );
    }

    get defaultPackageSets():IPackageSets {
        return this.newPackageSets(
            this.collections.newList(this.packagingConfig.packageSets)
        );
    }

    get defaultRepositories():IRepositories {
        return this.newRepositories(
            this.collections.newList<IRepositoryConfig>(this.packagingConfig.repositories),
            this.defaultPackageSets
        );
    }
}