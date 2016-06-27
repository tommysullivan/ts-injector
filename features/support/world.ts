declare var GLOBAL:any;
declare var module:any;
declare var require:any;

require('source-map-support').install();
import NodeFrameworkLoader from '../../lib/framework/node-framework-loader';
import '../step-definitions/cluster-preparation-steps';
import '../step-definitions/java-steps';
import '../step-definitions/packaging-steps';
import '../step-definitions/scp-steps';
import '../step-definitions/feature-set-steps';
import '../step-definitions/packaging-steps';
import '../step-definitions/version-graph-capture-steps';

var nodeframeworkLoader = new NodeFrameworkLoader();
var $ = GLOBAL.$ = nodeframeworkLoader.loadFramework();
module.exports = $.cucumber.world;