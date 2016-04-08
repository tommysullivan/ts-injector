"use strict";
var JiraConfiguration = (function () {
    function JiraConfiguration(configJSON) {
        this.configJSON = configJSON;
    }
    Object.defineProperty(JiraConfiguration.prototype, "jiraProtocolHostAndOptionalPort", {
        get: function () {
            return this.configJSON.stringPropertyNamed('jiraProtocolHostAndOptionalPort');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JiraConfiguration.prototype, "jiraRestSessionPath", {
        get: function () {
            return this.configJSON.stringPropertyNamed('jiraRestSessionPath');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JiraConfiguration.prototype, "jiraIssueSearchPath", {
        get: function () {
            return this.configJSON.stringPropertyNamed('jiraIssueSearchPath');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JiraConfiguration.prototype, "commentPathTemplate", {
        get: function () {
            return this.configJSON.stringPropertyNamed('commentPathTemplate');
        },
        enumerable: true,
        configurable: true
    });
    return JiraConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JiraConfiguration;
//# sourceMappingURL=jira-configuration.js.map