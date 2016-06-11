"use strict";
require('source-map-support').install();
var node_framework_loader_1 = require('../../lib/framework/node-framework-loader');
require('../step-definitions/cluster-management-steps');
require('../step-definitions/cluster-preparation-steps');
require('../step-definitions/elasticsearch-steps');
require('../step-definitions/grafana-steps');
require('../step-definitions/java-steps');
require('../step-definitions/manual-steps');
require('../step-definitions/mcs-steps');
require('../step-definitions/open-tsdb-steps');
require('../step-definitions/package-manager-installation-steps');
require('../step-definitions/packaging-steps');
require('../step-definitions/rest-based-installation-steps');
require('../step-definitions/scp-steps');
require('../step-definitions/secure-cluster-steps');
require('../step-definitions/ssh-steps');
require('../step-definitions/timing');
require('../step-definitions/user-steps');
require('../step-definitions/yarn-steps');
require('../step-definitions/mfs-steps');
require('../step-definitions/feature-set-steps');
require('../step-definitions/packaging-steps');
var nodeframeworkLoader = new node_framework_loader_1.default();
var $ = GLOBAL.$ = nodeframeworkLoader.loadFramework();
module.exports = $.cucumber.world;
//TODO: Add an around hook that nicely displays chai errors 
//# sourceMappingURL=world.js.map