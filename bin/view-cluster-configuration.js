#!/usr/bin/env node
var API = require('../lib/api');
var configJSON = require('../configuration/config.json');
var api = API(configJSON);
var configId = process.argv[2];
if(configId==null) throw new Error(`please provide configId as parameter. Choices: ${api.getAvailableTestClusterList()}`);
console.log(`getting config for id ${configId}`);
console.log(JSON.stringify(api.getFlattenedClusterConfig(configId)));