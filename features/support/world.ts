declare var GLOBAL:any;
declare var module:any;
declare var require:any;

require('source-map-support').install();
import NodeFrameworkLoader from '../../lib/framework/node-framework-loader';
import '../step-definitions/cluster-management-and-prep-steps';
import '../step-definitions/package-manager-installation-steps';
import '../step-definitions/elasticsearch-steps';
import '../step-definitions/grafana-steps';
import '../step-definitions/installation-steps';
import '../step-definitions/manual-steps';
import '../step-definitions/mcs-steps';
import '../step-definitions/open-tsdb-steps';
import '../step-definitions/ssh-steps';
import '../step-definitions/timing';
import '../step-definitions/yarn-steps';

var nodeframeworkLoader = new NodeFrameworkLoader();
var $ = GLOBAL.$ = nodeframeworkLoader.loadFramework();
module.exports = $.cucumber.world;