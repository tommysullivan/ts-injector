module.exports = function(servicesJSON, _) {
    return {
        specificVersionOfService: (serviceName, version) => {
            var service = _.findWhere(servicesJSON.resources, {name: serviceName, version: version});
            if(service==null) throw new Error(`Could not find service named ${serviceName} with version ${version}`);
            return service;
        }
    }
}