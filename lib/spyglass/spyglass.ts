import SpyglassHealthChecker from "./spyglass-health-checker";
import IErrors from "../errors/i-errors";
import IPackageSets from "../packaging/i-package-sets";
import IPhase from "../releasing/i-phase";

export default class Spyglass {
    private errors:IErrors;
    private packageSets:IPackageSets;
    private releasePhase:IPhase;

    constructor(errors:IErrors, packageSets:IPackageSets, releasePhase:IPhase) {
        this.errors = errors;
        this.packageSets = packageSets;
        this.releasePhase = releasePhase;
    }

    newSpyglassHealthChecker():SpyglassHealthChecker {
        var healthCheckablePackageNames = this.packageSets.all.firstWhere(p=>p.id=='healthCheckable').packages.map(p=>p.name);
        var spyglassPackageNames = this.releasePhase.packages.where(p=>p.tags.contain('spyglass')).map(p=>p.name);
        var healthCheckableSpyglassPackageNames = spyglassPackageNames.where(packageName=>healthCheckablePackageNames.contain(packageName));
        return new SpyglassHealthChecker(
            healthCheckableSpyglassPackageNames,
            this.errors
        );
    }
}