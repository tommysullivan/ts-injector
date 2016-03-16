#!/usr/bin/env node
var API = require('../lib/api');
var configJSON = require('../configuration/config.json');
var api = API(configJSON);
var clusterUnderTestId = process.argv[2];
if(clusterUnderTestId==null) throw new Error(`please provide clusterUnderTestId as the first command line argument. Choices: ${api.getAvailableTestClusterList()}`);
console.log(`getting config for id ${clusterUnderTestId}`);
console.log(JSON.stringify(api.getFlattenedClusterConfig(clusterUnderTestId), null, 3));