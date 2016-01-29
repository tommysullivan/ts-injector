var API = require('../../lib/api');
var configJSON = require('../../configuration/config.json');

module.exports = function() {
    this.World = function() {
        this.api = API(configJSON);
    };
};