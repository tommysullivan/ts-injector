module.exports = function(servicesJSON, _) {
    var getSpecificVersionOfService = (serviceName, version) => _.findWhere(
        servicesJSON.resources, {name: serviceName, version: version}
    );
    return {
        supportsServiceVersion: (serviceName, version) => getSpecificVersionOfService(serviceName, version) != null,
        all: () => servicesJSON.resources.filter(r=>r.type!='TEMPLATE')
    }
}