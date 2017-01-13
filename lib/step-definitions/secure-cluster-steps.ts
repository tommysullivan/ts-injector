import { binding as steps, given } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {INode} from "../clusters/i-node";
import {IFramework} from "../framework/common/i-framework";
import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IFuture} from "../futures/i-future";

declare const $:IFramework;
declare const module:any;

@steps()
export class SecureClusterSteps {
    private cldbNode:INode;

    @given(/^I run configure\.sh with genkeys and nostart option on first cldb node$/)
    generateAuthKeysViaNoStartAndGenKeysOptionOnFirstCLDBNode():PromisedAssertion {
        this.cldbNode = $.clusterUnderTest.nodesHosting('mapr-cldb').first;
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -genkeys -no-autostart`;
        const result = this.cldbNode.executeShellCommand(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I copy cldb key file to all other cldb nodes and zookeeper nodes$/)
    copyCLDBKeyFileToAllOtherCLDBAndZookeeperNodesInMem():PromisedAssertion {
        const result = this.cldbNode.read('/opt/mapr/conf/cldb.key')
            .then(data => $.clusterUnderTest.nodes
                .filter(n => n.isHostingService('mapr-cldb') || n.isHostingService('mapr-zookeeper'))
                .filter(n => n.host != this.cldbNode.host)
                .mapToFutureList(node => node.write(data, '/opt/mapr/conf/cldb.key'))
            );
        return $.expect(result).to.eventually.be.fulfilled;
    }

    private copyTextFileFromCLDBNodeToNonCLDBNodes(path:string):IFuture<IList<ISSHResult>> {
        return this.cldbNode
            .read(path)
            .then(data => $.clusterUnderTest.nodes
                .filter(n => n.host != this.cldbNode.host)
                .mapToFutureList(node => node.write(data, path))
            );
    }

    private copyBinaryFileFromCLDBNodeToNonCLDBNodes(path:string):IFuture<IList<ISSHResult>> {
        return this.cldbNode
            .readAsBinary(path)
            .then(data => $.clusterUnderTest.nodes
                .filter(n => n.host != this.cldbNode.host)
                .mapToFutureList(node => node.writeBinaryData(data, path))
            );
    }

    @given(/^I copy maprserverticket, ssl_keystore, ssl_truststore to all nodes$/)
    copyServerTicketKeyStoreAndTrustStoreToAllNodesInMem():PromisedAssertion {
        const allFileWrites = $.futures.newFutureListFromArray([
            this.copyTextFileFromCLDBNodeToNonCLDBNodes('/opt/mapr/conf/maprserverticket'),
            this.copyBinaryFileFromCLDBNodeToNonCLDBNodes('/opt/mapr/conf/ssl_keystore'),
            this.copyBinaryFileFromCLDBNodeToNonCLDBNodes('/opt/mapr/conf/ssl_truststore')
        ]);
        return $.expect(allFileWrites).to.eventually.be.fulfilled;
    }

    @given(/^I run configure\.sh with secure option on all nodes except first cldb node$/)
    runConfigureWithSecureOptionOnAllNodesExceptMainCLDBNode():PromisedAssertion {
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -no-autostart`;
        const result  = $.clusterUnderTest.nodes.filter(n => n.host != this.cldbNode.host).map(n => n.executeShellCommand(configCommand));
        return $.expectAll(result).to.eventually.be.fulfilled;
    }
}
module.exports = SecureClusterSteps;