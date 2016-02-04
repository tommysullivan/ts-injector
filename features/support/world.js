var API = require('../../lib/api');
var configJSON = require('../../configuration/config.json');

console.log("mcsProtocolHostAndOptionalPort="+process.env.mcsProtocolHostAndOptionalPort);

module.exports = function() {
    this.World = function() {
        this.api = API(configJSON);

        this.getArrayFromTable = function(table) {
            return table.rows().map(function(i) { return i[0]; });
        }
    };
};