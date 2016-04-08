"use strict";
var JiraTestResultComment = (function () {
    function JiraTestResultComment(testResultModel, collections) {
        this.testResultModel = testResultModel;
        this.collections = collections;
    }
    Object.defineProperty(JiraTestResultComment.prototype, "issueKey", {
        get: function () {
            return this.testResultModel.jiraKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JiraTestResultComment.prototype, "text", {
        get: function () {
            var summaryLines = this.testResultModel.summaries.map(function (s) { return s.displayText; });
            var lines = this.collections.newList([
                'Tests ' + this.testResultModel.status,
                'Detail Link: ' + this.testResultModel.testResultURL,
            ]).append(summaryLines);
            return lines.join("\n");
        },
        enumerable: true,
        configurable: true
    });
    JiraTestResultComment.prototype.toJSON = function () {
        return {
            issueKey: this.issueKey,
            text: this.text
        };
    };
    return JiraTestResultComment;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JiraTestResultComment;
//# sourceMappingURL=jira-test-result-comment.js.map