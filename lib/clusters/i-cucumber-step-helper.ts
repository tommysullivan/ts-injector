import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {IClusterUnderTestReferencer} from "../cluster-testing/i-cluster-under-test-referencer";
import {IFramework} from "../framework/common/i-framework";
import {IExpectationWrapper} from "../chai/i-expectation-wrapper";

export interface ICucumberStepHelper extends IFramework, IClusterUnderTestReferencer, IExpectationWrapper {}