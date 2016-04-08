"use strict";
var installer_rest_client_1 = require("./installer-rest-client");
var installer_server_configuration_1 = require("./installer-server-configuration");
var installer_rest_session_1 = require("./installer-rest-session");
var installer_process_1 = require("./installer-process");
var installer_services_1 = require("./installer-services");
var installer_service_1 = require("./installer-service");
var Installer = (function () {
    function Installer(clientConfiguration, rest, promiseFactory, collections, typedJSON) {
        this.clientConfiguration = clientConfiguration;
        this.rest = rest;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }
    Installer.prototype.newInstallerClient = function () {
        return new installer_rest_client_1.default(this, this.clientConfiguration, this.rest, this.typedJSON);
    };
    Installer.prototype.newInstallerRestSession = function (authedRestClient, apiJSON) {
        return new installer_rest_session_1.default(authedRestClient, this, this.clientConfiguration, apiJSON, this.typedJSON);
    };
    Installer.prototype.newInstallerServerConfiguration = function (serverConfigJSON, authedRestClient, serverConfigResourceURL) {
        return new installer_server_configuration_1.default(this, serverConfigJSON, authedRestClient, serverConfigResourceURL);
    };
    Installer.prototype.newInstallerProcess = function (processJSON, authedRestClient, processResourceURL) {
        return new installer_process_1.default(authedRestClient, processJSON, this.clientConfiguration, processResourceURL, this.promiseFactory);
    };
    Installer.prototype.newInstallerServices = function (servicesJSON, authedRestClient) {
        return new installer_services_1.default(servicesJSON, this.collections, this, authedRestClient);
    };
    Installer.prototype.newInstallerService = function (serviceJSON, authedRestClient) {
        return new installer_service_1.default(serviceJSON, authedRestClient, this.typedJSON);
    };
    return Installer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Installer;
//# sourceMappingURL=installer.js.map