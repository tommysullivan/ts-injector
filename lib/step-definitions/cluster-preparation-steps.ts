import {IError} from "../errors/i-error";
import {binding as steps, then, when} from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";

declare const $:ICucumberStepHelper;
declare const module:any;

@steps()
export class ClusterPreparationSteps {

    private ensureFailureOutputWorksWithChaiAsPromised(e:IError):void {
        throw new Error(e.toString());
    }

    @then(/^I retrieve the snapshot ids and output them to the stdout$/)
    retrieveSnapshotIdsAndOutputToConsole():PromisedAssertion {
        const snapshotInfoRequest = $.clusterUnderTest.snapshotInfo()
            .then(snapshotInfo=>$.console.log(snapshotInfo.toString()));
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    }

    @when(/^I revert the cluster to its configured "([^"]*)" state$/)
    revertClusterToState(desiredStateName:string):PromisedAssertion {
        const revertRequest = $.clusterUnderTest.revertToState(desiredStateName)
            .catch(e=>this.ensureFailureOutputWorksWithChaiAsPromised(e));
        return $.expect(revertRequest).to.eventually.be.fulfilled;
    }

    @when(/^I delete "([^"]*)" snapshots for each node in the cluster$/)
    deleteSnapshotsForEachNode(stateNameToDelete:string):PromisedAssertion {
        return $.expect($.clusterUnderTest.deleteSnapshotsWithStateName(stateNameToDelete)).to.eventually.be.fulfilled;
    }

    @when(/^I request the latest snapshot info from the cluster$/)
    requestLatestSnapshotInfo():PromisedAssertion {
        return $.expect($.clusterUnderTest.snapshotInfo()).to.eventually.be.fulfilled;
    }

    @when(/^I take "([^"]*)" snapshots of each node in the cluster$/)
    takeSnapshotsOfEachClusterNode(snapshotName:string):PromisedAssertion {
        return $.expect($.clusterUnderTest.captureSnapshotNamed(snapshotName)).to.eventually.be.fulfilled;
    }

    @when(/^I retrieve the latest snapshot info for the cluster and output it to stdout$/)
    retrieveLatestSnapshotInfoAndOutputToStdOut():PromisedAssertion {
        const snapshotInfoRequest = $.clusterUnderTest.snapshotInfo().then(i=>console.log(i.toString()));
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    }

    @then(/^I manually update the configured "([^"]*)" state for the cluster with the snapshot ids$/)
    manuallyUpdateConfiguredState(stateName:string):void {}

}
module.exports = ClusterPreparationSteps;