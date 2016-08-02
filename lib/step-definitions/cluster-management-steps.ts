import { binding as steps, given, when, then } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import Framework from "../framework/framework";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import IList from "../collections/i-list";

declare var $:Framework;
declare var module:any;

@steps()
export default class ClusterManagementSteps {
    private versionGraph:IClusterVersionGraph;
    private coreNodeHosts:IList<any>;

    @given(/^the Cluster Under Test is managed by ESXI$/)
    verifyClusterUnderTestIsESXI():void {
        $.expect($.clusterUnderTest.isManagedByESXI()).to.be.true;
    }

    @given(/^the Operating Systems of each node match what is configured$/)
    verifyOperatingSystemOnEachNodeMathcesWhatIsConfigured():void {
        $.console.log('WARN: step "the Operating Systems of each node match what is configured" currently does nothing');
    }

    @given(/^I power off each node in the cluster$/)
    powerOffEachNode():PromisedAssertion {
        return $.expect($.clusterUnderTest.powerOff()).to.eventually.be.fulfilled;
    }

    @then(/^the cluster does not have MapR Installed$/)
    verifyClusterDoesNotHaveMapRInstalled():PromisedAssertion {
        return $.expect($.clusterUnderTest.verifyMapRNotInstalled()).to.eventually.be.fulfilled;
    }

    @when(/^I request the cluster version graph$/)
    getClusterVersionGraph():PromisedAssertion {
        var futureVersionGraph = $.clusterUnderTest.versionGraph()
            .then(v=>this.versionGraph = v);
        return $.expect(futureVersionGraph).to.eventually.exist;
    }

    @then(/^it returns a valid JSON file$/)
    verifyVersionGraphIsValidJSON():void {
        var versionGraph:IClusterVersionGraph = this.versionGraph;
        $.expect(() => versionGraph.toJSONString()).not.to.throw;
    }

    @given(/^I have installed Spyglass$/)
    verifySpyglassIsInstalled():void {
        $.console.log('WARN: step "I have installed Spyglass" currently does nothing');
    }

    @given(/^the cluster has MapR Installed$/)
    verifyMaprInstalled():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n => n.verifyMapRIsInstalled())
        ).to.eventually.be.fulfilled;
    }

    @given(/^I have a node running the "([^"]*)" service$/)
    verifyNodeRunningSpecifiedServiceIsRunning(serviceName:string):void {
        var isHostingHbaseMasterServers=$.clusterUnderTest.nodesHosting(serviceName).isEmpty;
        $.expect(isHostingHbaseMasterServers).to.be.false;
    }

    @when(/^I "([^"]*)" all "([^"]*)" services$/)
    stopServiceOnAllNodesThatHostIt(command:string, serviceName:string):PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodesHosting(serviceName).map(n=> {
                return n.executeShellCommand(`service ${serviceName} ${command}`);
            })
        ).to.eventually.be.fulfilled;
    }

    @when(/^I "([^"]*)" all service named "([^"]*)" using maprcli$/)
    maprcliServiceRestart (serviceAction:string, serviceName:string):PromisedAssertion {
        var command = `maprcli node services -action ${serviceAction} -name ${serviceName} -nodes `;
        if(serviceName == 'hbmaster')
            var nodeList = $.clusterUnderTest.nodesHosting(`mapr-hbase-master`).map(n => n.host).join(` `);
        else if(serviceName == 'hbregionserver')
            var nodeList = $.clusterUnderTest.nodesHosting(`mapr-hbase-regionserver`).map(n => n.host).join(` `);
        else
            var nodeList = $.clusterUnderTest.nodesHosting(`mapr-${serviceName}`).map(n => n.host).join(` `);

        return $.expect($.clusterUnderTest.nodes().first().executeShellCommand(command + ` ` + nodeList)).to.eventually.be.fulfilled;
    }

    @given(/^I create a MapR auth ticket for the "([^"]*)" user with password "([^"]*)" on all nodes$/)
    generateUserTicket(userName:string, userPassword:string):PromisedAssertion {
        var ticketComamnd = `echo '${userPassword}' | maprlogin password`;
        var resultList = $.clusterUnderTest.nodes().map(n => {
            return $.sshAPI.newSSHClient().connect(n.host, userName, userPassword)
                .then(session=>session.executeCommand(ticketComamnd))
        })
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    }


    @given(/^I wait for cldb service to come up$/)
    checkIfCLDBRunning () {
        var command = `maprcli node cldbmaster`;
        var timeout:number = 10000;
        var result = $.clusterUnderTest.nodes().first().executeShellCommandWithTimeouts(command, timeout, 10);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I create a MapR auth ticket for the "([^"]*)" user with password "([^"]*)" on all nodes with timeout$/)
    generateUserTicketWithTimeout(userName:string, userPassword:string):PromisedAssertion {
        var ticketComamnd = `echo '${userPassword}' | maprlogin password`;
        var timeout:number = 10000;
        var maxTry:number = 10;
        var resultList = $.clusterUnderTest.nodes().map(n => {
            return $.sshAPI.newSSHClient().connect(n.host, userName, userPassword)
                .then(session=>session.executeCommandWithRetryTimeout(ticketComamnd, timeout, maxTry))
        });
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    }

    @given(/^I change the volume metrics collection interval to "([^"]*)" seconds$/)
    changeVolumeCollectionInterval(interval:string) {
        var collectDNode = $.clusterUnderTest.nodesHosting('mapr-collectd').first();
        var collectDVersion = collectDNode.packages.where(p => p.name == 'mapr-collectd').first().version;
        var replaceComamnd = `sed -i 's/Interval "600"/Interval "${interval}"/g' /opt/mapr/collectd/collectd-${collectDVersion}/etc/collectd.conf`;
        var result = $.clusterUnderTest.nodesHosting(`mapr-collectd`).map(n => n.executeShellCommand(replaceComamnd));
        return $.expectAll(result).to.eventually.be.fulfilled;
    }

    @when(/^I check for any cores on the cluster$/)
    checkForCores(): PromisedAssertion {
        this.coreNodeHosts = $.collections.newEmptyList();
        var result = $.clusterUnderTest.nodes().map(n => n.executeShellCommand(`ls -l /opt/cores/`)
            .then(result => {
                    if (result.processResult().stdoutLines().length > 2)
                        return this.coreNodeHosts.push(n);
                    else
                        return false;
                }
            ));
        return $.expectAll(result).to.eventually.be.fulfilled;
    }

    @then(/^I copy any existing cores to selfhosting$/)
    mountSelfHosting():PromisedAssertion {
        var checkPathCmd:string = `mkdir -p /home/MAPRTECH`;
        var mountPathCmd:string = `mount | grep 10.10.10.20:/mapr/selfhosting || mount 10.10.10.20:/mapr/selfhosting /home/MAPRTECH`;
        var d = new Date();
        var coreDir = `/home/MAPRTECH/spyglass-cores/core-${d.toLocaleDateString().replace(/\//g, '_')}-${d.toLocaleTimeString().replace(/ /g, '_')}`;
        var createDirCmd:string = `mkdir -p ${coreDir}`;
        if(this.coreNodeHosts.length > 0)
            console.log(`Copying core files to ${coreDir}`);
        var resultList = this.coreNodeHosts.map(n => n.executeShellCommands($.collections.newList([checkPathCmd, mountPathCmd, createDirCmd, `mkdir -p ${coreDir}/${n.host}`, `cp /opt/cores/* ${coreDir}/${n.host}/`])))
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    }

    @then(/^I fail the test if there were any core dumps$/)
    CheckAndFailWhenCorePresent(): void {
        if(this.coreNodeHosts.length > 0)
            throw new Error("Cores present and copied over");
    }


}
module.exports = ClusterManagementSteps;
