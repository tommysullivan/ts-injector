var servicesJSON = require('./services.json');
var _ = require('underscore');

var results = _.chain(servicesJSON.resources).where({core: true, version: '5.1.0'}).map(s=>s.name).uniq().value();
console.log(results);

// Here they are:
// mapr-mapreduce
// mapr-cldb
// mapr-metrics
// mapr-core
// mapr-nfs
// mapr-fileserver
// mapr-gateway
// mapr-nodemanager
// mapr-jobtracker
// mapr-historyserver
// mapr-resourcemanager
// mapr-yarn
// mapr-zookeeper
// mapr-tasktracker
// mapr-webserver