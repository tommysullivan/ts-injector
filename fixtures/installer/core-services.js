var servicesJSON = require('./services.json');
var _ = require('underscore');

var results = _.chain(servicesJSON.resources).where({core: true, version: '5.1.0'}).map(s=>s.name).uniq().value();
console.log(results);