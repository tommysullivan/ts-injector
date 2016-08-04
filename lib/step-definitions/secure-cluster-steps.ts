import { binding as steps, given, when, then } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import INodeUnderTest from "../cluster-testing/i-node-under-test";
import Framework from "../framework/framework";

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
    copyCLDBKeyFileToAllOtherCLDBAndZookeeperNodesInMem():PromisedAssertion {
        var result = this.cldbNode.read('/opt/mapr/conf/cldb.key')
            .then(data => {
                return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
                    .filter(n => n.isHostingService('mapr-cldb') || n.isHostingService('mapr-zookeeper'))
                    .filter(n => n.host != this.cldbNode.host).map(node => node.write(data, '/opt/mapr/conf/cldb.key')
                    ))
            });
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I copy maprserverticket, ssl_keystore, ssl_truststore to all nodes$/)
    copyServerTicketKeyStoreAndTrustStoreToAllNodesInMem():PromisedAssertion {
        var result1 = this.cldbNode.read('/opt/mapr/conf/maprserverticket').then(data => {
            return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().filter(n => n.host != this.cldbNode.host)
                .map(node => node.write(data, '/opt/mapr/conf/maprserverticket')))
            });

        var result2 = this.cldbNode.readAsBinary('/opt/mapr/conf/ssl_keystore').then(data => {
            return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().filter(n => n.host != this.cldbNode.host)
                .map(node => node.writeBinaryData(data, '/opt/mapr/conf/ssl_keystore')))
        });

        var result3 = this.cldbNode.readAsBinary('/opt/mapr/conf/ssl_truststore').then(data => {
            return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().filter(n => n.host != this.cldbNode.host)
                .map(node => node.writeBinaryData(data, '/opt/mapr/conf/ssl_truststore')))
        });

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