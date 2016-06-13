"use strict";
var YumConfigFileContent = (function () {
    function YumConfigFileContent() {
    }
    YumConfigFileContent.prototype.clientConfigurationFileContentFor = function (repository, descriptiveName, tagName) {
        return [
            ("[" + descriptiveName + "]"),
            ("name = " + descriptiveName),
            "enabled = 1",
            ("baseurl = " + repository.url),
            "protected = 1",
            "gpgcheck = 0"
        ].join("\n");
    };
    return YumConfigFileContent;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YumConfigFileContent;
//# sourceMappingURL=yum-config-file-content.js.map