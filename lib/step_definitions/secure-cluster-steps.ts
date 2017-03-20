import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {INode} from "../clusters/i-node";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    let cldbNode:INode;

    this.Before(function () {
        cldbNode = undefined;
    });

    this.Given(/^I run configure\.sh with genkeys and nostart option on first cldb node$/, ():PromisedAssertion => {
        cldbNode = $.clusterUnderTest.nodesHosting('mapr-cldb').first;
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -genkeys -no-autostart`;
        const result = cldbNode.executeShellCommand(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I copy cldb key file to all other cldb nodes and zookeeper nodes$/, ():PromisedAssertion => {
        const result = cldbNode.read('/opt/mapr/conf/cldb.key')
            .then(data => $.clusterUnderTest.nodes
                .filter(n => n.isHostingService('mapr-cldb') || n.isHostingService('mapr-zookeeper'))
                .filter(n => n.host != cldbNode.host)
                .mapToFutureList(node => node.write(data, '/opt/mapr/conf/cldb.key'))
            );
        return $.expect(result).to.eventually.be.fulfilled;
    });

    function copyTextFileFromCLDBNodeToNonCLDBNodes(path:string):IFuture<IList<void>> {
        return cldbNode
            .read(path)
            .then(data => $.clusterUnderTest.nodes
                .filter(n => n.host != cldbNode.host)
                .mapToFutureList(node => node.write(data, path))
            );
    }

    function copyBinaryFileFromCLDBNodeToNonCLDBNodes(path:string):IFuture<IList<void>> {
        return cldbNode
            .readAsBinary(path)
            .then(data => $.clusterUnderTest.nodes
                .filter(n => n.host != cldbNode.host)
                .mapToFutureList(node => node.writeBinaryData(data, path))
            );
    }

    this.Given(/^I copy maprserverticket, ssl_keystore, ssl_truststore to all nodes$/, ():PromisedAssertion => {
        const allFileWrites = $.futures.newFutureListFromArray([
            copyTextFileFromCLDBNodeToNonCLDBNodes('/opt/mapr/conf/maprserverticket'),
            copyBinaryFileFromCLDBNodeToNonCLDBNodes('/opt/mapr/conf/ssl_keystore'),
            copyBinaryFileFromCLDBNodeToNonCLDBNodes('/opt/mapr/conf/ssl_truststore')
        ]);
        return $.expect(allFileWrites).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh with secure option on all nodes except first cldb node$/, ():PromisedAssertion => {
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -no-autostart`;
        const result  = $.clusterUnderTest.nodes.filter(n => n.host != cldbNode.host).map(n => n.executeShellCommand(configCommand));
        return $.expectAll(result).to.eventually.be.fulfilled;
    });
};