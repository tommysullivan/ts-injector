"use strict";
var NodeUnderTest = (function () {
    function NodeUnderTest(nodeConfiguration, sshClient, promiseFactory, collections, mcs, openTSDB, installer, elasticSearch, versioning, nodeRepoUrlProvider) {
        this.nodeConfiguration = nodeConfiguration;
        this.sshClient = sshClient;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.mcs = mcs;
        this.openTSDB = openTSDB;
        this.installer = installer;
        this.elasticSearch = elasticSearch;
        this.versioning = versioning;
        this.nodeRepoUrlProvider = nodeRepoUrlProvider;
    }
    Object.defineProperty(NodeUnderTest.prototype, "hostNameAccordingToNode", {
        get: function () {
            return this.executeShellCommand('hostname')
                .then(function (r) {
                console.log(r.processResult().stdoutLines().first());
                return r.processResult().stdoutLines().first();
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeUnderTest.prototype, "repository", {
        get: function () {
            return this.nodeConfiguration.operatingSystem.repository;
        },
        enumerable: true,
        configurable: true
    });
    NodeUnderTest.prototype.newSSHSession = function () {
        return this.sshClient.connect(this.nodeConfiguration.host, this.nodeConfiguration.username, this.nodeConfiguration.password);
    };
    NodeUnderTest.prototype.repoConfigFileContentFor = function (componentFamily) {
        return this.repository.configFileContentFor(componentFamily, this.repoUrlFor(componentFamily));
    };
    NodeUnderTest.prototype.repoUrlFor = function (componentFamily) {
        return this.nodeRepoUrlProvider.urlFor(this.operatingSystem.name, componentFamily);
    };
    NodeUnderTest.prototype.repoConfigFileLocationFor = function (componentFamily) {
        return this.repository.configFileLocationFor(componentFamily);
    };
    NodeUnderTest.prototype.executeShellCommand = function (shellCommand) {
        return this.newSSHSession().then(function (s) { return s.executeCommand(shellCommand); });
    };
    NodeUnderTest.prototype.executeShellCommands = function (commandsWithPlaceholders) {
        var _this = this;
        var commands = commandsWithPlaceholders.map(function (c) { return c.replace('{{packageCommand}}', _this.packageCommand); });
        return this.newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommands(commands); });
    };
    NodeUnderTest.prototype.upload = function (localPath, remotePath) {
        return this.newSSHSession()
            .then(function (sshSession) { return sshSession.upload(localPath, remotePath); });
    };
    NodeUnderTest.prototype.download = function (remotePath, localPath) {
        return this.newSSHSession()
            .then(function (sshSession) { return sshSession.download(remotePath, localPath); });
    };
    NodeUnderTest.prototype.write = function (content, remotePath) {
        return this.newSSHSession()
            .then(function (sshSession) { return sshSession.write(content, remotePath); });
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
                var processResult = sshError.sshResult ? sshError.sshResult.processResult() : null;
                if (processResult && processResult.processExitCode() == 2) {
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
    NodeUnderTest.prototype.verifyMapRIsInstalled = function () {
        var _this = this;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            _this.newSSHSession()
                .then(function (sshSession) {
                return sshSession.executeCommand('ls /opt/mapr');
            })
                .then(function (shellCommandResult) {
                resolve(shellCommandResult);
            })
                .catch(function (sshError) {
                var errorMessage = [
                    ("Could not determine if /opt/mapr exists on host " + _this.nodeConfiguration.host + "."),
                    ("Result: " + sshError.toString())
                ].join('');
                reject(new Error(errorMessage));
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
    Object.defineProperty(NodeUnderTest.prototype, "serviceNames", {
        get: function () {
            return this.nodeConfiguration.serviceNames.clone();
        },
        enumerable: true,
        configurable: true
    });
    NodeUnderTest.prototype.toJSON = function () {
        return this.nodeConfiguration.toJSON();
    };
    return NodeUnderTest;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeUnderTest;
//# sourceMappingURL=node-under-test.js.map