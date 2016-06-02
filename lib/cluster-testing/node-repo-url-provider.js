"use strict";
var NodeRepoUrlProvider = (function () {
    function NodeRepoUrlProvider(repoUrlProvider, phase, coreVersion) {
        this.repoUrlProvider = repoUrlProvider;
        this.phase = phase;
        this.coreVersion = coreVersion;
    }
    NodeRepoUrlProvider.prototype.urlFor = function (operatingSystemName, componentFamilyName) {
        return this.repoUrlProvider.urlFor(this.phase, this.coreVersion, operatingSystemName, componentFamilyName);
    };
    return NodeRepoUrlProvider;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeRepoUrlProvider;
//# sourceMappingURL=node-repo-url-provider.js.map