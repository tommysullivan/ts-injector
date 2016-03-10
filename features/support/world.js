var API = require('../../lib/api');
var configJSON = require('../../configuration/config.json');

module.exports = function() {

    var feature, scenario, step, world;

    this.setDefaultTimeout(60 * 1000);

    this.World = function() {
        world = this;
        this.api = API(configJSON);
        this.repositories = this.api.newRepositories(process.env['phase'])
        this.clusterUnderTest = this.api.newClusterUnderTest(process.env['clusterUnderTestId'], this.repositories);
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