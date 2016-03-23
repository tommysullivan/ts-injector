module.exports = function(servicesJSON, _) {
    var getSpecificVersionOfService = (serviceName, version) => _.findWhere(
        servicesJSON.resources, {name: serviceName, version: version}
    );
    return {
        supportsServiceVersion: (serviceName, version) => getSpecificVersionOfService(serviceName, version) != null,
        all: () => servicesJSON.resources.filter(r=>r.type!='TEMPLATE'),
        elasticSearch: () => getSpecificVersionOfService('mapr-elasticsearch', '2.2.0'),
        openTSDB: () => getSpecificVersionOfService('mapr-opentsdb', '2.2.0'),
        mcs: () => getSpecificVersionOfService('mapr-webserver', '5.1.0')
    }
}