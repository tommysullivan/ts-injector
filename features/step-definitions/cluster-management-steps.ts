import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import IClusterVersionGraph from "../../lib/versioning/i-cluster-version-graph";
declare var $:Framework;
declare var module:any;

@steps()
export default class ClusterManagementSteps {
    private clusterName:string;
    private versionGraph:IClusterVersionGraph;

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

    @then(/^I get the clusterName$/)
    getClusterName():PromisedAssertion {
        var futureClusterName = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand('/opt/mapr/bin/maprcli dashboard info -json'))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                var clusterName=json.data[0].cluster.name;
                console.log(clusterName);
                this.clusterName = clusterName;
                return clusterName;
            });
        return $.expect(futureClusterName).to.eventually.exist;
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

    @when(/^I ([^"]*) all "([^"]*)" services$/)
    stopServiceOnAllNodesThatHostIt(command:string, serviceName:string):PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodesHosting(serviceName).map(n=> {
                return n.executeShellCommand(`service ${serviceName} ${command}`);
            })
        ).to.eventually.be.fulfilled;
    }
}
module.exports = ClusterManagementSteps;