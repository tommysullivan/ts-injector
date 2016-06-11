"use strict";
var CucumberCliHelper = (function () {
    function CucumberCliHelper(console, cucumber, process, temporaryTestRunOutputFilePath) {
        this.console = console;
        this.cucumber = cucumber;
        this.process = process;
        this.temporaryTestRunOutputFilePath = temporaryTestRunOutputFilePath;
    }
    CucumberCliHelper.prototype.outputJSON = function (list) {
        this.console.log(list.toJSONString());
    };
    CucumberCliHelper.prototype.showFeatureSets = function () {
        var args = this.process.commandLineArguments();
        if (args.itemAt(3) == 'in' && args.itemAt(4) == 'detail')
            this.outputJSON(this.cucumber.featureSets.all);
        else
            this.outputJSON(this.cucumber.featureSets.all.map(function (t) { return t.id; }));
    };
    CucumberCliHelper.prototype.executeTagsCli = function () {
        var _this = this;
        var cucumberConfig = this.cucumber.newCucumberRunConfiguration(true, this.temporaryTestRunOutputFilePath, '', this.process.environmentVariables().clone());
        this.cucumber.newCucumberRunner(this.process, this.console).runCucumber(cucumberConfig)
            .then(function (t) {
            _this.console.log(t.uniqueTagNames().toJSONString());
        })
            .catch(function (error) {
            _this.console.log("There was an error fetching tags: " + (error.stack ? error.stack : error.toString()));
        });
    };
    return CucumberCliHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberCliHelper;
//# sourceMappingURL=cucumber-cli-helper.js.map