"use strict";
var CliExecutor = (function () {
    function CliExecutor(process, console, cucumberCliHelper, clusterCliHelper, clusterTesterCliHelper, testPortal, cliHelper) {
        this.process = process;
        this.console = console;
        this.cucumberCliHelper = cucumberCliHelper;
        this.clusterCliHelper = clusterCliHelper;
        this.clusterTesterCliHelper = clusterTesterCliHelper;
        this.testPortal = testPortal;
        this.cliHelper = cliHelper;
    }
    CliExecutor.prototype.execute = function () {
        var _this = this;
        try {
            var command = this.process.getArgvOrThrow('command', 2);
            if (command == 'tags')
                this.cucumberCliHelper.executeTagsCli();
            else if (command == 'featureSets')
                this.cucumberCliHelper.showFeatureSets();
            else if (command == 'cluster')
                this.clusterCliHelper.executeClusterCli();
            else if (command == 'run')
                this.clusterTesterCliHelper.executeTestRunCli();
            else if (command == 'server') {
                var args = this.process.commandLineArguments();
                var env = this.process.environmentVariables();
                var promptForJiraCreds = args.itemAt(3) == 'with' && args.itemAt(4) == 'jira';
                var jiraUsername = env.hasKey('jiraUsername')
                    ? env.get('jiraUsername')
                    : promptForJiraCreds
                        ? this.console.askQuestion('JIRA username: ')
                        : 'non-existent-user';
                var jiraPassword = env.hasKey('jiraPassword')
                    ? env.get('jiraPassword')
                    : promptForJiraCreds
                        ? this.console.askSensitiveQuestion('JIRA Password: ')
                        : 'non-existent-password';
                this.testPortal.newTestPortalWebServer(jiraUsername, jiraPassword).startServer()
                    .then(function (message) { return _this.console.log(message); })
                    .catch(function (e) { return _this.cliHelper.logError(e); });
            }
            else
                throw new Error("Invalid command " + command);
        }
        catch (e) {
            this.logUsage();
            this.cliHelper.logError(e.message);
            if (this.process.environmentVariables().get('debug') == 'true')
                throw e;
        }
    };
    CliExecutor.prototype.logUsage = function () {
        this.console.log([
            '',
            'Usage:',
            (this.process.processName() + " [command] [command specific arguments]"),
            '',
            'commands                  description',
            '--------                  -----------',
            'run                       execute some tests',
            'tags                      list available cucumber tags',
            'featureSets [in detail]   list runnable featureSets, optionally "in detail"',
            'cluster                   manage the cluster under test',
            'server [with jira]        run the server (if words "with jira" are present, you will be prompted for creds)',
            ''
        ].join('\n'));
    };
    return CliExecutor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CliExecutor;
//# sourceMappingURL=cli-executor.js.map