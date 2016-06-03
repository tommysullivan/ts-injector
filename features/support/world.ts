declare var GLOBAL:any;
declare var module:any;
declare var require:any;

require('source-map-support').install();
import NodeFrameworkLoader from '../../lib/framework/node-framework-loader';
import '../step-definitions/cluster-management-steps';
import '../step-definitions/cluster-preparation-steps';
import '../step-definitions/elasticsearch-steps';
import '../step-definitions/grafana-steps';
import '../step-definitions/java-steps';
import '../step-definitions/manual-steps';
import '../step-definitions/mcs-steps';
import '../step-definitions/open-tsdb-steps';
import '../step-definitions/package-manager-installation-steps';
import '../step-definitions/packaging-steps';
import '../step-definitions/rest-based-installation-steps';
import '../step-definitions/scp-steps';
import '../step-definitions/secure-cluster-steps';
import '../step-definitions/ssh-steps';
import '../step-definitions/timing';
import '../step-definitions/user-steps';
import '../step-definitions/yarn-steps';
import '../step-definitions/mfs-steps';
import '../step-definitions/feature-set-steps';
import '../step-definitions/packaging-steps';

var nodeframeworkLoader = new NodeFrameworkLoader();
var $ = GLOBAL.$ = nodeframeworkLoader.loadFramework();
module.exports = $.cucumber.world;

//TODO: Add an around hook that nicely displays chai errors