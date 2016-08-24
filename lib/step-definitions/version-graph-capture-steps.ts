import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../framework/framework";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
declare const $:Framework;
declare const module:any;

@steps()
export default class VersionGraphCaptureSteps {
    private versionGraph:IClusterVersionGraph;

    @when(/^I request the cluster version graph$/)
    getClusterVersionGraph():PromisedAssertion {
        const futureVersionGraph = $.clusterUnderTest.versionGraph()
            .then(v=>this.versionGraph = v);
        return $.expect(futureVersionGraph).to.eventually.exist;
    }

    @then(/^it returns a valid JSON file$/)
    verifyVersionGraphIsValidJSON():void {
        const versionGraph:IClusterVersionGraph = this.versionGraph;
        $.expect(() => versionGraph.toJSONString()).not.to.throw;
    }
}
module.exports = VersionGraphCaptureSteps;