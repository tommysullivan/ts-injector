var API = require('../../lib/api');
var configJSON = require('../../configuration/config.json');

module.exports = function() {

    var feature, scenario, step, world;

    this.setDefaultTimeout(60 * 1000);

    this.World = function() {
        world = this;
        this.api = API(configJSON);
        this.getArrayFromTable = function(table) {
            return table.rows().map(function(i) { return i[0]; });
        }
        this.runSSHCommands = function(host, username, password, commands, resolve, reject) {
            this.api.newSSHClient().connect(host, username, password).done(
                sshSession => {
                    sshSession.executeCommands(commands.concat(['exit'])).done(
                        output=> {
                            sshSession.close();
                            resolve(output);
                        },
                        error => {
                            sshSession.close();
                            reject(error);
                        }
                    );
                },
                reject
            );
        }
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