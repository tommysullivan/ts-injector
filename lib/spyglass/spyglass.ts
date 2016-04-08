import SpyglassHealthChecker from "./spyglass-health-checker";
import SpyglassConfig from "./spyglass-config";
import IErrors from "../errors/i-errors";

export default class Spyglass {
    private spyglassConfig:SpyglassConfig;
    private errors:IErrors;

    constructor(spyglassConfig:SpyglassConfig, errors:IErrors) {
        this.spyglassConfig = spyglassConfig;
        this.errors = errors;
    }

    newSpyglassHealthChecker():SpyglassHealthChecker {
        return new SpyglassHealthChecker(
            this.spyglassConfig.spyglassHealthCheckServiceNames,
            this.errors
        );
    }
}