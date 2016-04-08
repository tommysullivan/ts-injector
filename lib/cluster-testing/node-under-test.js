"use strict";
var NodeUnderTest = (function () {
    function NodeUnderTest(nodeConfiguration, sshClient, promiseFactory, collections, mcs, openTSDB, installer, elasticSearch, versioning) {
        this.nodeConfiguration = nodeConfiguration;
        this.sshClient = sshClient;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.mcs = mcs;
        this.openTSDB = openTSDB;
        this.installer = installer;
        this.elasticSearch = elasticSearch;
        this.versioning = versioning;
    }
    NodeUnderTest.prototype.repoUrlFor = function (componentFamily) {
        return this.nodeConfiguration.operatingSystem.repository.urlFor(componentFamily);
    };
    NodeUnderTest.prototype.newSSHSession = function () {
        return this.sshClient.connect(this.nodeConfiguration.host, this.nodeConfiguration.username, this.nodeConfiguration.password);
    };
    NodeUnderTest.prototype.executeShellCommands = function (commandsWithPlaceholders) {
        var _this = this;
        var commands = commandsWithPlaceholders.map(function (c) { return c.replace('{{packageCommand}}', _this.packageCommand); });
        return this.newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommands(commands); });
    };
    NodeUnderTest.prototype.verifyMapRNotInstalled = function () {
        var _this = this;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            _this.newSSHSession()
                .then(function (sshSession) {
                return sshSession.executeCommand('ls /opt/mapr');
            })
                .then(function (shellCommandResult) {
                reject(new Error("/opt/mapr directory exists on host " + _this.nodeConfiguration.host));
            })
                .catch(function (sshError) {
                if (sshError.sshResult.processResult().processExitCode() == 2) {
                    resolve(sshError.sshResult);
                }
                else {
                    var errorMessage = [
                        ("Could not determine if /opt/mapr exists on host " + _this.nodeConfiguration.host + "."),
                        ("Result: " + sshError.toString())
                    ].join('');
                    reject(new Error(errorMessage));
                }
            });
        });
    };
    NodeUnderTest.prototype.newAuthedMCSSession = function () {
        return this.mcs.newMCSClient(this.host).createAutheticatedSession(this.username, this.password);
    };
    NodeUnderTest.prototype.newOpenTSDBRestClient = function () {
        return this.openTSDB.newOpenTSDBRestClient(this.host);
    };
    NodeUnderTest.prototype.newAuthedInstallerSession = function () {
        return this.installer.newInstallerClient().createAutheticatedSession("https://" + this.host + ":9443", this.username, this.password);
    };
    NodeUnderTest.prototype.newElasticSearchClient = function () {
        return this.elasticSearch.newElasticSearchClient(this.host);
    };
    NodeUnderTest.prototype.versionGraph = function () {
        var _this = this;
        var commands = this.collections.newList([
            this.packageListCommand,
            this.repoListCommand
        ]);
        return this.newSSHSession()
            .then(function (shellSession) { return shellSession.executeCommands(commands); })
            .then(function (commandResultSet) { return _this.versioning.newNodeVersionGraph(_this.host, commandResultSet); });
    };
    Object.defineProperty(NodeUnderTest.prototype, "packageCommand", {
        get: function () {
            return this.operatingSystem.repository.packageCommand;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeUnderTest.prototype, "host", {
        get: function () {
            return this.nodeConfiguration.host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeUnderTest.prototype, "username", {
        get: function () {
            return this.nodeConfiguration.username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeUnderTest.prototype, "password", {
        get: function () {
            return this.nodeConfiguration.password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeUnderTest.prototype, "operatingSystem", {
        get: function () {
            return this.nodeConfiguration.operatingSystem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeUnderTest.prototype, "repoListCommand", {
        get: function () {
            return this.operatingSystem.repository.repoListCommand;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeUnderTest.prototype, "packageListCommand", {
        get: function () {
            return this.operatingSystem.repository.packageListCommand;
        },
        enumerable: true,
        configurable: true
    });
    NodeUnderTest.prototype.isHostingService = function (serviceName) {
        return this.nodeConfiguration.serviceNames.contain(serviceName);
    };
    NodeUnderTest.prototype.toJSON = function () {
        return this.nodeConfiguration.toJSON();
    };
    return NodeUnderTest;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeUnderTest;
//# sourceMappingURL=node-under-test.js.map