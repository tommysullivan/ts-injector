module.exports = function(dashboardInfoJSONObject) {
    return {
        validateHealthOfSpyglassServices: function() {
            var services = dashboardInfoJSONObject.data[0].services;
            var spyglassServicesNamesInMCSDashboardInfo = [
                'collectd',
                'fluentd',
                'elasticsearch',
                'opentsdb',
                'kibana',
                'grafana'
            ]
            var spyglassServices = spyglassServicesNamesInMCSDashboardInfo.map(function(serviceName) {
                return {
                    serviceName: serviceName,
                    status: services[serviceName]
                };
            });
            var failedServices = spyglassServices.filter(function(serviceObject) {
                var passed = serviceObject != null
                    && serviceObject.status != null
                    && serviceObject.status.total > 0
                    && serviceObject.status.failed === 0
                    && serviceObject.status.stopped === 0
                    && serviceObject.status.active == serviceObject.status.total;
                return !passed;
            });
            if(failedServices.length > 0) {
                throw new Error(
                    "MCS Reporting Unhealthy Spyglass Services: " + JSON.stringify(failedServices)
                );
            }
        }
    }
}