import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    let versionGraph:IClusterVersionGraph;

    this.Before(function () {
        versionGraph = undefined;
    });

    this.When(/^I request the cluster version graph$/, ():PromisedAssertion => {
        const futureVersionGraph = $.clusterUnderTest.versionGraph()
            .then(v=>versionGraph = v);
        return $.expect(futureVersionGraph).to.eventually.exist;
    });

    this.Then(/^it returns a valid JSON file$/, ():void => {
        $.expect(() => versionGraph.toString()).not.to.throw;
    });
};