import {IRepositoryConfig} from "./i-repository-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {IPackageSetRefConfig} from "./i-package-set-ref-config";
import {IPackageConfig} from "./i-package-config";
import {PackageSetRefConfig} from "./package-set-ref-config";
import {PackageConfig} from "./package-config";

export class RepositoryConfig implements IRepositoryConfig {
    constructor(
        private repositoryConfigJSON:IJSONObject
    ) {}

    get url():string {
        return this.repositoryConfigJSON.stringPropertyNamed('url');
    }

    get packages():Array<IPackageConfig | IPackageSetRefConfig> {
        return this.repositoryConfigJSON.listOfJSONObjectsNamed('packages')
            .map(j => j.hasPropertyNamed('packageSetRef')
                ? new PackageSetRefConfig(j)
                : new PackageConfig(j)
            ).toArray();
    }
}