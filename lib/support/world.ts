declare const GLOBAL:any;
declare const module:any;
declare const require:any;

require('source-map-support').install();

import {NodeFrameworkLoader} from '../framework/node-framework-loader';
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
import './shared-data'

const nodeframeworkLoader = new NodeFrameworkLoader();
const $ = GLOBAL.$ = nodeframeworkLoader.loadFramework();
module.exports = $.cucumber.world;