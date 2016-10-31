import {IList} from "../collections/i-list";
import {IRepository} from "./i-repository";
import {Exception} from "../errors/exception";
import {PackageRepositoryNotFoundException} from "./package-repository-not-found-exception";

export class PackageRepositoryIsAmbiguousException extends Exception {
    public name:string = 'PackageRepositoryIsAmbiguousException';

    constructor(
        public repositoryError:PackageRepositoryNotFoundException,
        public repositoriesContainingPackage:IList<IRepository>,
        public preferredRepositories:IList<IRepository>
    ) {
        super(
            'Multiple repositories host the sought package. '
            +"To disambiguate, consider adding the sought release (if applicable) to the repository's \"releases\" property. "
            +repositoryError.message
            +` repositoriesContainingPackage: ${repositoriesContainingPackage.map(r=>r.url).join(',')}; `
            +` preferredRepositories: ${preferredRepositories.isEmpty ? '[none]' : preferredRepositories.map(r=>r.url).join(',')}`
        );
    }
}