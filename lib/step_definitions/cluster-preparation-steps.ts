import {IError} from "../errors/i-error";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    function ensureFailureOutputWorksWithChaiAsPromised(e:IError):void {
        throw new Error(e.toString());
    }

    this.Then(/^I retrieve the snapshot ids and output them to the stdout$/, ():PromisedAssertion => {
        const snapshotInfoRequest = $.clusterUnderTest.snapshotInfo()
            .then(snapshotInfo=>$.console.log(snapshotInfo.toString()));
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I delete "([^"]*)" snapshots for each node in the cluster$/, (stateNameToDelete:string):PromisedAssertion => {
        return $.expect($.clusterUnderTest.deleteSnapshotsWithStateName(stateNameToDelete)).to.eventually.be.fulfilled;
    });

    this.When(/^I request the latest snapshot info from the cluster$/, ():PromisedAssertion => {
        return $.expect($.clusterUnderTest.snapshotInfo()).to.eventually.be.fulfilled;
    });

    this.When(/^I take "([^"]*)" snapshots of each node in the cluster$/, (snapshotName:string):PromisedAssertion => {
        return $.expect($.clusterUnderTest.captureSnapshotNamed(snapshotName)).to.eventually.be.fulfilled;
    });

    this.When(/^I retrieve the latest snapshot info for the cluster and output it to stdout$/, ():PromisedAssertion => {
        const snapshotInfoRequest = $.clusterUnderTest.snapshotInfo().then(i=>console.log(i.toString()));
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I revert the cluster to its configured "([^"]*)" state$/, (desiredStateName: string): PromisedAssertion => {
        const revertRequest = $.clusterUnderTest.revertToState(desiredStateName)
            .catch(e => this.ensureFailureOutputWorksWithChaiAsPromised(e));
        return $.expect(revertRequest).to.eventually.be.fulfilled;
    });

    this.Then(/^I manually update the configured "([^"]*)" state for the cluster with the snapshot ids$/, () => null );

};