var API = require('../../lib/api');
var configJSON = require('../../configuration/config.json');
var api = API(configJSON);

var clusterId = process.env['clusterId'];
if(clusterId==null) throw new Error([
    "Please set environment variable 'clusterId'",
    "to the ID of one of the clusters in configuration/config.json",
    "within the 'testClusters' array by choosing from the following cluster ids:",
    api.getAvailableTestClusterList()
].join(' '));

var phase = process.env['phase'];
if(phase==null) throw new Error([
    "Please set environment variable 'phase'",
    "to the phase of product lifecycle being tested",
    "choosing from among the following phases:",
    api.getAvailableRepositoryTypes()
].join(' '));

module.exports = function() {
    this.setDefaultTimeout(configJSON['defaultCucumberStepTimeoutMS']);
    this.World = function() {
        this.api = api;
        var repositories = this.api.newRepositories(phase);
        this.clusterUnderTest = this.api.newClusterUnderTest(clusterId, repositories);
        this.getArrayFromTable = table => table.rows().map(r=>r[0]);

        this.guiInstallerURL = function() {
            var installerHost = this.clusterUnderTest.nodeHosting('GUI Installer');
            return installerHost.urlFor('GUI Installer');
        }

        this.verifyGUIInstallerWebServerIsRunning = function(callback) {
            var url = this.guiInstallerURL();
            var path = '/';
            this.api.newRestClientAsPromised(url).get(path).done(
                success=>callback(),
                errorHttpResult=>callback(`Could not reach GUI Installer website. Status Code: ${errorHttpResult.toString()}, url: ${url}${path}`)
            );
        }

        this.installerRestClient = function() {
            return this.api.newInstallerRESTClient(this.guiInstallerURL());
        }

        this.createInstallerRestSession = function() {
            return this.installerRestClient().createAutheticatedSession('mapr','mapr');
        }
    };
};