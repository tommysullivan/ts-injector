import {ICucumberStepHelper} from "./i-cucumber-step-helper";
import {FrameworkForNodeJS} from "../framework/nodejs/framework-for-node-js";
import {ICluster} from "./i-cluster";
import {Assertion} from "../chai/assertion";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {IClusterUnderTestReferencer} from "../cluster-testing/i-cluster-under-test-referencer";
import {IExpectationWrapper} from "../chai/i-expectation-wrapper";

export class CucumberStepHelper  extends FrameworkForNodeJS implements ICucumberStepHelper {

    constructor(
        private expectationWrapper:IExpectationWrapper,
        private clusterUnderTestReferencer:IClusterUnderTestReferencer,
        nativeRequire:any,
        nativeProcess:any
    ){
        super(nativeRequire, nativeProcess);
    }

    expect(target: any, message?: string): Assertion {
        return this.expectationWrapper.expect(target, message);
    }

    expectAll<T>(target: IList<IFuture<T>>): Assertion {
        return this.expectationWrapper.expectAll(target);
    }

    expectEmptyList<T>(list: IList<T>): void {
        return this.expectationWrapper.expectEmptyList(list);
    }

    get clusterId():string {
        return this.clusterUnderTestReferencer.clusterId;
    }

    get clusterUnderTest():ICluster {
        return this.clusterUnderTestReferencer.clusterUnderTest;
    }
}