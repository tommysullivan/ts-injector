import IPackage from "./i-package";

export default class PackageComparer {
    
    equals(package1:IPackage, package2:IPackage):boolean {
        return package1.name==package2.name
            && package1.version.matches(package2.version.toString())
            && package1.supportedOperatingSystems.containAll(package2.supportedOperatingSystems)
            && package2.supportedOperatingSystems.containAll(package1.supportedOperatingSystems)
            && package1.promotionLevel.equals(package2.promotionLevel)
            && package1.tags.containAll(package2.tags)
            && package2.tags.containAll(package1.tags);
    }
}