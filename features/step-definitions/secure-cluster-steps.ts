import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import INodeUnderTest from "../../lib/cluster-testing/i-node-under-test";
declare var $:Framework;
declare var module:any;

@steps()
export default class SecureClusterSteps {
    private cldbNode:INodeUnderTest;

    @given(/^I run configure\.sh with genkeys and nostart option on first cldb node$/)
    generateAuthKeysViaNoStartAndGenKeysOptionOnFirstCLDBNode():PromisedAssertion {
        this.cldbNode = $.clusterUnderTest.nodesHosting('mapr-cldb').first();
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -genkeys -no-autostart`;
        var result = this.cldbNode.executeShellCommand(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I copy cldb key file to all other cldb nodes and zookeeper nodes$/)
    copyCLDBKeyFileToAllOtherCLDBAndZookeeperNodes():PromisedAssertion {
        var result = this.cldbNode.download('/opt/mapr/conf/cldb.key', './data/tmp/cldb.key')
            .then(n => $.clusterUnderTest.nodes().filter(n => n.isHostingService('mapr-cldb') || n.isHostingService('mapr-zookeeper'))
                .filter(n => n.host != this.cldbNode.host).map(node => node.upload('./data/tmp/cldb.key', '/opt/mapr/conf/cldb.key')))
        return $.expect(result).to.eventually.be.fulfilled;
    }

    //TODO: Use the in memory upload / download to avoid state dependence
    @given(/^I copy maprserverticket, ssl_keystore, ssl_truststore to all nodes$/)
    copyServerTicketKeyStoreAndTrustStoreToAllNodes():PromisedAssertion {
        var result1 = this.cldbNode.download('/opt/mapr/conf/maprserverticket', 'data/tmp/maprserverticket')
            .then(_ => $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
                .filter(n => n.host != this.cldbNode.host).map(n => n.upload('data/tmp/maprserverticket', '/opt/mapr/conf/maprserverticket'))));

        var result2 = this.cldbNode.download('/opt/mapr/conf/ssl_keystore', 'data/tmp/ssl_keystore')
            .then(_ => $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
                .filter(n => n.host != this.cldbNode.host).map(n => n.upload('data/tmp/ssl_keystore', '/opt/mapr/conf/ssl_keystore'))));

        var result3 = this.cldbNode.download('/opt/mapr/conf/ssl_truststore', 'data/tmp/ssl_truststore')
            .then(_ => $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
                .filter(n => n.host != this.cldbNode.host).map(n => n.upload('data/tmp/ssl_truststore', '/opt/mapr/conf/ssl_truststore'))));

        return $.expectAll($.collections.newList([result1, result2, result3])).to.eventually.be.fulfilled;
    }

    @given(/^I run configure\.sh with secure option on all nodes except first cldb node$/)
    runConfigureWithSecureOptionOnAllNodesExceptMainCLDBNode():PromisedAssertion {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -no-autostart`;
        var result  = $.clusterUnderTest.nodes().filter(n => n.host != this.cldbNode.host).map(n => n.executeShellCommand(configCommand));
        return $.expectAll(result).to.eventually.be.fulfilled;
    }
}
module.exports = SecureClusterSteps;