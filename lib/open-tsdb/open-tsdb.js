"use strict";
var open_tsdb_rest_client_1 = require("./open-tsdb-rest-client");
var open_tsdb_result_1 = require("./open-tsdb-result");
var OpenTSDB = (function () {
    function OpenTSDB(rest, openTSDBConfig, collections, typedJSON) {
        this.rest = rest;
        this.openTSDBConfig = openTSDBConfig;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }
    OpenTSDB.prototype.newOpenTSDBRestClient = function (host) {
        var openTSDBHostAndPort = this.openTSDBConfig.openTSDBUrlTemplate.replace('{host}', host);
        return new open_tsdb_rest_client_1.default(this.rest, this.openTSDBConfig.openTSDBQueryPathTemplate, openTSDBHostAndPort, this, this.collections);
    };
    OpenTSDB.prototype.newOpenTSDBResponse = function (soughtTags, metricName, jsonArray) {
        return new open_tsdb_result_1.default(soughtTags, metricName, jsonArray, this.collections, this.typedJSON);
    };
    return OpenTSDB;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSDB;
//# sourceMappingURL=open-tsdb.js.map