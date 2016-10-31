import {Exception} from "../errors/exception";

export class PackageRepositoryNotFoundException extends Exception {
    public name:string = 'PackageRepositoryNotFoundException';

    constructor(
        public soughtPackageName:string,
        public soughtPackageVersion:string,
        public soughtOperatingSystem:string,
        public soughtPromotionLevel:string,
        public soughtReleaseName:string
    ) {
        super(
            `could not find package for soughtPackageName: ${soughtPackageName}, soughtPackageVersion: ${soughtPackageVersion}, `
            +`soughtOperatingSystem: ${soughtOperatingSystem}, soughtPromotionLevel:${soughtPromotionLevel}, soughtReleaseName:${soughtReleaseName}. `
        );
    }

}