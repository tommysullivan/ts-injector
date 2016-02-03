module.exports = function(dashboardInfoJSONObject, spyglassServicesNamesInMCSDashboardInfo) {
    return {
        unhealthySpyglassServices: function() {
            var services = dashboardInfoJSONObject.data[0].services;
            var spyglassServices = spyglassServicesNamesInMCSDashboardInfo.map(function(serviceName) {
                return {
                    serviceName: serviceName,
                    status: services[serviceName]
                };
            });
            var unhealthyServices = spyglassServices.filter(function(serviceObject) {
                var passed = serviceObject != null
                    && serviceObject.status != null
                    && serviceObject.status.total > 0
                    && serviceObject.status.failed === 0
                    && serviceObject.status.stopped === 0
                    && serviceObject.status.active == serviceObject.status.total;
                return !passed;
            });
            return unhealthyServices;
        }
    }
}