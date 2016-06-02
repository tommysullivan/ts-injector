"use strict";
var RepositoryUrlProvider = (function () {
    function RepositoryUrlProvider(typedJson) {
        this.typedJson = typedJson;
    }
    RepositoryUrlProvider.prototype.urlFor = function (phase, coreVersion, operatingSystem, componentFamily) {
        return phase == 'dev'
            ? "http://" + this.basePathDuringDevPhase(operatingSystem, componentFamily) + "/" + this.productLocationDuringDevPhase(operatingSystem, componentFamily)
            : "http://" + this.basePathAfterDevPhase(phase, componentFamily) + "/" + this.productLocationAfterDevPhase(operatingSystem, componentFamily, coreVersion);
    };
    RepositoryUrlProvider.prototype.basePathDuringDevPhase = function (operatingSystem, componentFamily) {
        return componentFamily == 'MEP'
            ? 'artifactory.devops.lab'
            : this.typedJson.newJSONObject({
                'ubuntu': 'apt.qa.lab',
                'redhat': 'yum.qa.lab',
                'suse': 'yum.qa.lab'
            }).stringPropertyNamed(operatingSystem);
    };
    RepositoryUrlProvider.prototype.basePathAfterDevPhase = function (phase, componentFamily) {
        return this.typedJson.newJSONObject({
            'production': 'package.mapr.com/releases',
            'staging': componentFamily == 'spyglass' ? 'spyglass:monitoring@stage.mapr.com/beta' : 'maprqa:maprqa@stage.mapr.com/mapr',
            'limited beta': 'spyglass:monitoring@stage.mapr.com/beta'
        }).stringPropertyNamed(phase);
    };
    RepositoryUrlProvider.prototype.productLocationDuringDevPhase = function (operatingSystem, componentFamily) {
        return this.typedJson.newJSONObject({
            'core': operatingSystem == 'suse' ? 'mapr-suse' : 'mapr',
            'ecosystem': 'opensource',
            'spyglass': 'opensource/spyglass-beta',
            'MEP': "artifactory/list/prestage/releases-dev/MEP/MEP-1.0.0/" + operatingSystem,
            'mapr-patch': 'v5.1.0-spyglass',
            'installer': 'installer-master-ui'
        }).stringPropertyNamed(componentFamily);
    };
    RepositoryUrlProvider.prototype.productLocationAfterDevPhase = function (operatingSystem, componentFamily, coreVersion) {
        var productLocation = this.typedJson.newJSONObject({
            'core': "v" + coreVersion,
            'ecosystem': 'ecosystem-5.x',
            'spyglass': 'spyglass',
            'MEP': 'MEP/MEP-1.0.0',
            'mapr-patch': 'spyglass',
            'installer': 'installer'
        }).stringPropertyNamed(componentFamily);
        return productLocation + "/" + operatingSystem;
    };
    return RepositoryUrlProvider;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RepositoryUrlProvider;
//# sourceMappingURL=repository-url-provider.js.map