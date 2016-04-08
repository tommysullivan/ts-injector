#!/usr/bin/env node
var guiConfigPath = process.argv[2];
var restConfigPath = process.argv[3];
if(guiConfigPath==null) throw new Error('1st arg should be path to gui-generated installer config (look in fixtures)');
if(restConfigPath==null) throw new Error('2nd arg should be path to rest-automation-generated installer config (look in fixtures)');

var fs = require('fs');
var guiConfig = JSON.parse(fs.readFileSync(guiConfigPath)).services;
var restConfig = JSON.parse(fs.readFileSync(restConfigPath)).services;
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

//if only one or the other is present and enabled is false, then eliminate it

function xor(a,b) {
    return ( a && !b ) || ( !a && b )
}

function onlyOneAndItIsDisabled(r) {
    return xor(r.gui, r.rest) && r.gui ? !r.gui.enabled : !r.rest.enabled;
}

var discrepancies = result.filter(r=>!r.matchingEnablement);
discrepancies = discrepancies.filter(r=>!onlyOneAndItIsDisabled(r));
console.log(JSON.stringify(discrepancies, null, 3));
console.log("num discrepancies: "+discrepancies.length);