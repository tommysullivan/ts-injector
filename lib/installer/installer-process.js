"use strict";
var InstallerProcess = (function () {
    function InstallerProcess(authedRestClient, processJSON, clientConfig, processResourceURL, promiseFactory) {
        this.authedRestClient = authedRestClient;
        this.processJSON = processJSON;
        this.clientConfig = clientConfig;
        this.processResourceURL = processResourceURL;
        this.promiseFactory = promiseFactory;
    }
    InstallerProcess.prototype.checkOutcomePeriodically = function (stateChange, successState, resolve, reject) {
        var _this = this;
        this.authedRestClient.get(this.processResourceURL)
            .then(function (result) {
            var state = result.jsonBody().state;
            if (state == stateChange)
                setTimeout(function () { return _this.checkOutcomePeriodically(stateChange, successState, resolve, reject); }, _this.clientConfig.installerPollingFrequencyMS);
            else {
                if (state == successState)
                    resolve(null);
                else
                    reject(new Error("Unexpected process state " + state));
            }
        });
    };
    InstallerProcess.prototype.performStateChange = function (stateChange, successState) {
        var _this = this;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            var patchArgs = {
                body: { state: stateChange },
                json: true
            };
            _this.authedRestClient.patch(_this.processResourceURL, patchArgs)
                .then(function (_) { return _this.checkOutcomePeriodically(stateChange, successState, resolve, reject); });
        });
    };
    InstallerProcess.prototype.validate = function () {
        return this.performStateChange('CHECKING', 'CHECKED');
    };
    InstallerProcess.prototype.provision = function () {
        return this.performStateChange('PROVISIONING', 'PROVISIONED');
    };
    InstallerProcess.prototype.install = function () {
        return this.performStateChange('INSTALLING', 'INSTALLED');
    };
    InstallerProcess.prototype.log = function () {
        var httpOptions = {
            headers: {
                'Accept': 'text/plain'
            }
        };
        var url = this.processJSON.jsonObjectNamed('links').stringPropertyNamed('log');
        return this.authedRestClient.get(url, httpOptions)
            .then(function (response) { return response.body(); });
    };
    return InstallerProcess;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstallerProcess;
//# sourceMappingURL=installer-process.js.map