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

    var feature, scenario, step, world;

    this.setDefaultTimeout(configJSON['defaultCucumberStepTimeoutMS']);

    this.World = function() {
        world = this;
        this.api = api;
        this.repositories = this.api.newRepositories(phase);
        this.clusterUnderTest = this.api.newClusterUnderTest(clusterId, this.repositories);
        this.getArrayFromTable = table => table.rows().map(r=>r[0]);
    };

    this.BeforeStep(function(event, callback) {
        world.step = event.getPayloadItem('step');
        callback();
    });

    this.Before(function(event, callback) {
        this.feature = feature;
        this.scenario = scenario;
        this.tags = event.getTags();
        callback();
    });

    this.BeforeFeature(function(event, callback) {
        feature = event.getPayloadItem('feature');
        callback();
    });

    this.BeforeScenario(function(event, callback) {
        scenario = event.getPayloadItem('scenario');
        callback();
    });

};