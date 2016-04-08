"use strict";
var open_tsdb_rest_client_1 = require("./open-tsdb-rest-client");
var OpenTSDB = (function () {
    function OpenTSDB(rest, openTSDBConfig) {
        this.rest = rest;
        this.openTSDBConfig = openTSDBConfig;
    }
    OpenTSDB.prototype.newOpenTSDBRestClient = function (host) {
        var openTSDBHostAndPort = this.openTSDBConfig.openTSDBUrlTemplate.replace('{host}', host);
        return new open_tsdb_rest_client_1.default(this.rest, this.openTSDBConfig.openTSDBQueryPathTemplate, openTSDBHostAndPort);
    };
    return OpenTSDB;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSDB;
//# sourceMappingURL=open-tsdb.js.map