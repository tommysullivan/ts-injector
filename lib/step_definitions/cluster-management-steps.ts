import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IList} from "../collections/i-list";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICustomWorld} from "../cucumber/i-custom-world";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    let versionGraph:IClusterVersionGraph;
    let coreNodeHosts:IList<any>;

    this.Before(function () {
       versionGraph = undefined;
       coreNodeHosts = undefined;
    });

    this.Given(/^the Cluster Under Test is managed by ESXI$/, () => {
        $.expect($.clusterUnderTest.isManagedByESXI).to.be.true;
    });

    this.Given(/^the Operating Systems of each node match what is configured$/, () => {
        $.console.log('WARN: step "the Operating Systems of each node match what is configured" currently does nothing');
    });

    this.Given(/^I power off each node in the cluster$/, ():PromisedAssertion => {
        return $.expect($.clusterUnderTest.powerOff()).to.eventually.be.fulfilled;
    });

    this.Then(/^the cluster does not have MapR Installed$/, function (this: ICustomWorld): PromisedAssertion {
        return $.expect($.clusterUnderTest.verifyMapRNotInstalled()).to.eventually.be.fulfilled;
    });

    this.When(/^I request the cluster version graph$/, ():PromisedAssertion => {
        const futureVersionGraph = $.clusterUnderTest.versionGraph()
            .then(v=>versionGraph = v);
        return $.expect(futureVersionGraph).to.eventually.exist;
    });

    this.Then(/^it returns a valid JSON file$/, () => {
        $.expect(() => versionGraph.toString()).not.to.throw;
    });

    this.Given(/^I have installed Spyglass$/, () => {
        $.console.log('WARN: step "I have installed Spyglass" currently does nothing');
    });

    this.Given(/^the cluster has MapR Installed$/, ():PromisedAssertion => {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(n => n.verifyMapRIsInstalled())
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I have a node running the "([^"]*)" service$/, (serviceName:string) => {
        const isHostingHbaseMasterServers=$.clusterUnderTest.nodesHosting(serviceName).isEmpty;
        $.expect(isHostingHbaseMasterServers).to.be.false;
    });

    this.When(/^I "([^"]*)" all "([^"]*)" services$/, (command:string, serviceName:string):PromisedAssertion => {
        return $.expectAll(
            $.clusterUnderTest.nodesHosting(serviceName).map(n=> {
                return n.executeShellCommand(`service ${serviceName} ${command}`);
            })
        ).to.eventually.be.fulfilled;
    });

    this.When(/^I "([^"]*)" all service named "([^"]*)" using maprcli$/, (serviceAction:string, serviceName:string):PromisedAssertion => {
        const command = `maprcli node services -action ${serviceAction} -name ${serviceName} -nodes `;
        const packageNameForService = {
            'hbmaster': 'mapr-hbase-master',
            'hbregionserver': 'mapr-hbase-regionserver',
        }[serviceName] || `mapr-${serviceName}`;
        const nodeList = $.clusterUnderTest.nodesHosting(packageNameForService).map(n => n.host).join(` `);
        return $.expect($.clusterUnderTest.nodes.first.executeShellCommand(command + ` ` + nodeList)).to.eventually.be.fulfilled;
    });

    this.Given(/^I create a MapR auth ticket for the "([^"]*)" user with password "([^"]*)" on all nodes$/, (userName:string, userPassword:string):PromisedAssertion => {
        const ticketComamnd = `echo '${userPassword}' | maprlogin password`;
        const resultList = $.clusterUnderTest.nodes.map(n => {
            return $.sshAPI.newSSHClient().connect(n.host, userName, userPassword)
                .then(session=>session.executeCommand(ticketComamnd))
        });
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    });


    this.Given(/^I wait for cldb service to come up$/, ():PromisedAssertion => {
        const command = `maprcli node cldbmaster`;
        const timeout:number = 10000;
        const result = $.clusterUnderTest.nodes.first.executeShellCommandWithTimeouts(command, timeout, 10);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I create a MapR auth ticket for the "([^"]*)" user with password "([^"]*)" on all nodes with timeout$/, (userName:string, userPassword:string):PromisedAssertion => {
        const ticketComamnd = `echo '${userPassword}' | maprlogin password`;
        const timeout:number = 10000;
        const maxTry:number = 10;
        const resultList = $.clusterUnderTest.nodes.map(n => {
            return $.sshAPI.newSSHClient().connect(n.host, userName, userPassword)
                .then(session=>session.executeCommandWithRetryTimeout(ticketComamnd, timeout, maxTry))
        });
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    });

    this.Given(/^I change the volume metrics collection interval to "([^"]*)" seconds$/, (interval:string):PromisedAssertion => {
        const collectDNode = $.clusterUnderTest.nodesHosting('mapr-collectd').first;
        const collectDVersion = collectDNode.packages.where(p => p.name == 'mapr-collectd').first.version;
        const replaceComamnd = `sed -i 's/Interval "600"/Interval "${interval}"/g' /opt/mapr/collectd/collectd-${collectDVersion}/etc/collectd.conf`;
        const result = $.clusterUnderTest.nodesHosting(`mapr-collectd`).map(n => n.executeShellCommand(replaceComamnd));
        return $.expectAll(result).to.eventually.be.fulfilled;
    });

    this.When(/^I check for any cores on the cluster$/, ():PromisedAssertion => {
        coreNodeHosts = $.collections.newEmptyList();
        const result = $.clusterUnderTest.nodes.map(n => n.executeShellCommand(`ls -l /opt/cores/`)
            .then(result => {
                    if (result.processResult.stdoutLines.length > 2)
                        return coreNodeHosts.push(n);
                    else
                        return false;
                }
            ));
        return $.expectAll(result).to.eventually.be.fulfilled;
    });

    this.Then(/^I copy any existing cores to selfhosting$/, ():PromisedAssertion => {
        const checkPathCmd:string = `mkdir -p /home/MAPRTECH`;
        const mountPathCmd:string = `mount | grep 10.10.10.20:/mapr/selfhosting || mount 10.10.10.20:/mapr/selfhosting /home/MAPRTECH`;
        const d = new Date();
        const coreDir = `/home/MAPRTECH/spyglass-cores/core-${d.toLocaleDateString().replace(/\//g, '_')}-${d.toLocaleTimeString().replace(/ /g, '_')}`;
        const createDirCmd:string = `mkdir -p ${coreDir}`;
        if(coreNodeHosts.length > 0)
            console.log(`Copying core files to ${coreDir}`);
        const resultList = coreNodeHosts.map(n => n.executeShellCommands($.collections.newList([checkPathCmd, mountPathCmd, createDirCmd, `mkdir -p ${coreDir}/${n.host}`, `cp /opt/cores/* ${coreDir}/${n.host}/`])));
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    });

    this.Then(/^I fail the test if there were any core dumps$/, () => {
        if(coreNodeHosts.length > 0)
            throw new Error("Cores present and copied over");
    });

    this.Given(/^I stop "([^"]*)" service on all nodes if they are running$/, (serviceName:string):PromisedAssertion => {
        const serviceCheckCommand:string = `service ${serviceName} status`;
        const serviceStopCommand:string = `service ${serviceName} stop`;
        const commandRunResult = $.clusterUnderTest.nodes.map( n => n.executeShellCommands(serviceCheckCommand, serviceStopCommand)
            .catch(error => console.log(`No such process running`)));
        return $.expectAll(commandRunResult).to.eventually.be.fulfilled;
    });

};
