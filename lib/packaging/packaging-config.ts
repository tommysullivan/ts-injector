import {IPackagingConfig} from "./i-packaging-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {PackageSetConfig} from "./package-set-config";
import {IPackageSetConfig} from "./i-package-set-config";
import {IRepositoryConfig} from "./i-repository-config";
import {RepositoryConfig} from "./repository-config";

export class PackagingConfig implements IPackagingConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get packageSets():Array<IPackageSetConfig> {
        return this.configJSON.listOfJSONObjectsNamed('packageSets')
            .map(packageSetConfigJSON => new PackageSetConfig(packageSetConfigJSON))
            .toArray();
    }

    get repositories():Array<IRepositoryConfig> {
        return this.configJSON.listOfJSONObjectsNamed('repositories')
            .map(repositoryConfigJSON => new RepositoryConfig(repositoryConfigJSON))
            .toArray();
    }
}