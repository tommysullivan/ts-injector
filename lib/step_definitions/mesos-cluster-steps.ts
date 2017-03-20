import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    this.Given(/^I am able to access mesos cluster host$/, ():PromisedAssertion => {
        // const result = $.framework.newClusterLoader.loadCluster.then(cluster => cluster.nodes.first.host);
        const result = $.clusterUnderTest.nodes.first.host;
        console.log(result);
        return $.expect(result).to.not.be.null;
    });

    this.Given(/^I run the following shell command on docker node$/, (command:string):PromisedAssertion => {
        const result = $.clusterUnderTest.nodes.first.executeShellCommand(command).then(res => console.log(res.processResult.stdoutLines));
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I am able to access all mesos cluster host$/, (): PromisedAssertion => {
        const result = $.clusterUnderTest.nodes.map(node => node.host);
        console.log(result);
        return $.expect(result).to.not.be.null;
    });

    this.Given(/^I run the following shell command on docker all nodes$/, (command:string): PromisedAssertion => {
        const result = $.clusterUnderTest.nodes.mapToFutureList(node => node.executeShellCommand(command).then(r => console.log(r.processResult.stdoutLines)));
        return $.expect(result).to.eventually.be.fulfilled;
    });
};