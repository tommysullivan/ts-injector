declare const GLOBAL:any;
declare const module:any;
declare const require:any;
declare const process:any;

require('source-map-support').install();

import '../step-definitions/cluster-preparation-steps';
import '../step-definitions/java-steps';
import '../step-definitions/packaging-steps';
import '../step-definitions/scp-steps';
import '../step-definitions/feature-set-steps';
import '../step-definitions/packaging-steps';
import '../step-definitions/version-graph-capture-steps';
import '../step-definitions/cluster-management-steps';
import '../step-definitions/mfs-steps';
import '../step-definitions/package-manager-installation-steps';
import '../step-definitions/rest-based-installation-steps';
import '../step-definitions/secure-cluster-steps';
import '../step-definitions/user-steps';
import '../step-definitions/node-services-steps';
import '../step-definitions/docker-steps';
import './shared-data'
import {CucumberStepHelper} from "../clusters/cucumber-step-helper";
import {frameworkForNodeJSInstance} from "../framework/nodejs/framework-for-node-js-instance";


const clusterTesting = frameworkForNodeJSInstance.clusterTesting;
const clusterUnderTestReferencer = clusterTesting.newClusterUnderTestReferencer();
const $ = GLOBAL.$ = new CucumberStepHelper(frameworkForNodeJSInstance.cucumber.newExpectationWrapper(), clusterUnderTestReferencer, require, process);
module.exports = frameworkForNodeJSInstance.cucumber.world(clusterUnderTestReferencer);