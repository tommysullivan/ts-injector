"use strict";
var ClusterTesterCliHelper = (function () {
    function ClusterTesterCliHelper(process, console, cucumber, clusterTestingConfiguration, clusterTesting, clusters, promiseFactory, collections, multiClusterTester, cliHelper) {
        this.process = process;
        this.console = console;
        this.cucumber = cucumber;
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.clusterTesting = clusterTesting;
        this.clusters = clusters;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.multiClusterTester = multiClusterTester;
        this.cliHelper = cliHelper;
    }
    ClusterTesterCliHelper.prototype.executeTestRunCli = function () {
        var _this = this;
        try {
            var subCommand = this.process.getArgvOrThrow('subCommand', 3);
            if (subCommand == 'cucumber') {
                var cucumberPassThruCommands = this.process.commandLineArguments().everythingAfterIndex(3);
                this.runCucumber(cucumberPassThruCommands);
            }
            else if (subCommand == 'featureSet') {
                var featureSetId = this.process.getArgvOrThrow('featureSetId', 4);
                var featureSet = this.cucumber.featureSets.setWithId(featureSetId);
                var cucumberPassThruCommands = featureSet.featureFilesInExecutionOrder.append(this.process.commandLineArguments().everythingAfterIndex(4));
                this.runCucumber(cucumberPassThruCommands);
            }
            else if (subCommand == 'command') {
                var command = this.process.commandLineArguments().everythingAfterIndex(3).join(' ');
                var clusters = this.clusterTestingConfiguration.clusterIds.map(function (clusterId) { return _this.clusterTesting.newClusterUnderTest(_this.clusters.clusterConfigurationWithId(clusterId)); });
                var restrictNodesBasedOnServices = this.process.environmentVariables().hasKey('nodesWith');
                clusters.forEach(function (cluster) {
                    var nodesForShellCommand = restrictNodesBasedOnServices
                        ? _this.nodesRunningRequestedServices(cluster)
                        : cluster.nodes();
                    var commandPromises = nodesForShellCommand.map(function (n) { return n.executeShellCommand(command); });
                    _this.promiseFactory.newGroupPromise(commandPromises)
                        .then(function (result) {
                        _this.console.log('*****************************************');
                        _this.console.log("Cluster Result for id \"" + cluster.name);
                        _this.console.log("\n");
                        _this.console.log(result.toJSONString());
                    });
                });
            }
            else
                throw new Error("Invalid command " + subCommand);
        }
        catch (e) {
            this.logTestRunUsage();
            throw e;
        }
    };
    ClusterTesterCliHelper.prototype.runCucumber = function (cucumberPassThruCommands) {
        var _this = this;
        this.multiClusterTester.runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(cucumberPassThruCommands)
            .then(function (clusterTestResults) {
            var allPassed = clusterTestResults.all(function (t) { return t.passed(); });
            if (clusterTestResults.length > 1) {
                _this.console.log("Multi Cluster Test of " + clusterTestResults.length + " clusters " + (allPassed ? 'Passed' : 'Failed'));
                clusterTestResults.forEach(function (result) {
                    _this.console.log("Cluster " + result.clusterId + ": " + (result.passed() ? 'passed' : 'failed'));
                });
            }
            _this.process.exit(allPassed ? 0 : 1);
        })
            .catch(function (e) { return _this.cliHelper.logError(e); });
    };
    ClusterTesterCliHelper.prototype.nodesRunningRequestedServices = function (cluster) {
        var requisiteServiceNames = this.collections.newList(this.process.environmentVariableNamed('nodesWith').split(','));
        return cluster.nodes().where(function (n) { return n.serviceNames.containAll(requisiteServiceNames); });
    };
    ClusterTesterCliHelper.prototype.logTestRunUsage = function () {
        this.console.log([
            '',
            'Usage:',
            (this.process.processName() + " run [target]"),
            '',
            'targets                                         description',
            '-------                                         -----------',
            'featureSet [featureSetId]                       run cucumber with the specified featureset (to list available run command "featureSets")',
            'cucumber [args passed thru to cucumber.js]      reset cluster power or turn it off or on',
            'command [command]                               run arbitrary command on each node in cluster(s). If environment variable "nodesWith" is set',
            '                                                to a comma separated list of service names, then commands will only run on nodes that have those services'
        ].join('\n'));
    };
    return ClusterTesterCliHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTesterCliHelper;
//# sourceMappingURL=cluster-tester-cli-helper.js.map