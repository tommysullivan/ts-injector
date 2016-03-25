var guiConfig = require('./gui-config.json').services;
var restConfig = require('./rest-config.json').services;
var _ = require('underscore');

var keys = Object.keys(guiConfig).concat(Object.keys(restConfig));
keys = _.uniq(keys);
keys.sort();

var result = keys.map(k=>{
    var g = guiConfig[k];
    var r = restConfig[k];
    return {
        name: k,
        matchingVersion: g && r && g.version==r.version,
        matchingEnablement: g && r && g.enabled== r.enabled,
        gui: g,
        rest: r
    }
});
var discrepancies = result.filter(r=>!r.matchingEnablement);
console.log(JSON.stringify(discrepancies, null, 3));
console.log("num discrepancies: "+discrepancies.length);