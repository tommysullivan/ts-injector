declare const GLOBAL:any;
declare const module:any;
declare const require:any;
declare const process:any;

require('source-map-support').install();

import {CucumberStepHelper} from "../clusters/cucumber-step-helper";
import {frameworkForNodeJSInstance} from "../framework/nodejs/framework-for-node-js-instance";


const clusterTesting = frameworkForNodeJSInstance.clusterTesting;
const clusterUnderTestReferencer = clusterTesting.newClusterUnderTestReferencer();
const $ = GLOBAL.$ = new CucumberStepHelper(frameworkForNodeJSInstance.cucumber.newExpectationWrapper(), clusterUnderTestReferencer, require, process);
module.exports = frameworkForNodeJSInstance.cucumber.world(clusterUnderTestReferencer);