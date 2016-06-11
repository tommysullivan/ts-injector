"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var SecureClusterSteps = (function () {
    function SecureClusterSteps() {
    }
    SecureClusterSteps.prototype.generateAuthKeysViaNoStartAndGenKeysOptionOnFirstCLDBNode = function () {
        this.cldbNode = $.clusterUnderTest.nodesHosting('mapr-cldb').first();
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(function (n) { return n.host; }).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(function (n) { return n.host; }).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand = "/opt/mapr/server/configure.sh -C " + cldbHostsString + " -Z " + zookeeperHostsString + " -HS " + historyHostString + " -u mapr -g mapr -N " + $.clusterUnderTest.name + " -F /root/disk.list -secure -genkeys -no-autostart";
        var result = this.cldbNode.executeShellCommand(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    SecureClusterSteps.prototype.copyCLDBKeyFileToAllOtherCLDBAndZookeeperNodes = function () {
        var _this = this;
        var result = this.cldbNode.download('/opt/mapr/conf/cldb.key', './data/tmp/cldb.key')
            .then(function (n) { return $.clusterUnderTest.nodes().filter(function (n) { return n.isHostingService('mapr-cldb') || n.isHostingService('mapr-zookeeper'); })
            .filter(function (n) { return n.host != _this.cldbNode.host; }).map(function (node) { return node.upload('./data/tmp/cldb.key', '/opt/mapr/conf/cldb.key'); }); });
        return $.expect(result).to.eventually.be.fulfilled;
    };
    //TODO: Use the in memory upload / download to avoid state dependence
    SecureClusterSteps.prototype.copyServerTicketKeyStoreAndTrustStoreToAllNodes = function () {
        var _this = this;
        var result1 = this.cldbNode.download('/opt/mapr/conf/maprserverticket', 'data/tmp/maprserverticket')
            .then(function (_) { return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
            .filter(function (n) { return n.host != _this.cldbNode.host; }).map(function (n) { return n.upload('data/tmp/maprserverticket', '/opt/mapr/conf/maprserverticket'); })); });
        var result2 = this.cldbNode.download('/opt/mapr/conf/ssl_keystore', 'data/tmp/ssl_keystore')
            .then(function (_) { return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
            .filter(function (n) { return n.host != _this.cldbNode.host; }).map(function (n) { return n.upload('data/tmp/ssl_keystore', '/opt/mapr/conf/ssl_keystore'); })); });
        var result3 = this.cldbNode.download('/opt/mapr/conf/ssl_truststore', 'data/tmp/ssl_truststore')
            .then(function (_) { return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
            .filter(function (n) { return n.host != _this.cldbNode.host; }).map(function (n) { return n.upload('data/tmp/ssl_truststore', '/opt/mapr/conf/ssl_truststore'); })); });
        return $.expectAll($.collections.newList([result1, result2, result3])).to.eventually.be.fulfilled;
    };
    SecureClusterSteps.prototype.runConfigureWithSecureOptionOnAllNodesExceptMainCLDBNode = function () {
        var _this = this;
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(function (n) { return n.host; }).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(function (n) { return n.host; }).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand = "/opt/mapr/server/configure.sh -C " + cldbHostsString + " -Z " + zookeeperHostsString + " -HS " + historyHostString + " -u mapr -g mapr -N " + $.clusterUnderTest.name + " -F /root/disk.list -secure -no-autostart";
        var result = $.clusterUnderTest.nodes().filter(function (n) { return n.host != _this.cldbNode.host; }).map(function (n) { return n.executeShellCommand(configCommand); });
        return $.expectAll(result).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.given(/^I run configure\.sh with genkeys and nostart option on first cldb node$/)
    ], SecureClusterSteps.prototype, "generateAuthKeysViaNoStartAndGenKeysOptionOnFirstCLDBNode", null);
    __decorate([
        cucumber_tsflow_1.given(/^I copy cldb key file to all other cldb nodes and zookeeper nodes$/)
    ], SecureClusterSteps.prototype, "copyCLDBKeyFileToAllOtherCLDBAndZookeeperNodes", null);
    __decorate([
        cucumber_tsflow_1.given(/^I copy maprserverticket, ssl_keystore, ssl_truststore to all nodes$/)
    ], SecureClusterSteps.prototype, "copyServerTicketKeyStoreAndTrustStoreToAllNodes", null);
    __decorate([
        cucumber_tsflow_1.given(/^I run configure\.sh with secure option on all nodes except first cldb node$/)
    ], SecureClusterSteps.prototype, "runConfigureWithSecureOptionOnAllNodesExceptMainCLDBNode", null);
    SecureClusterSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], SecureClusterSteps);
    return SecureClusterSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SecureClusterSteps;
module.exports = SecureClusterSteps;
//# sourceMappingURL=secure-cluster-steps.js.map