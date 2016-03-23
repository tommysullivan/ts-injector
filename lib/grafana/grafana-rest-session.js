module.exports = function(authedRestClient, grafanaDashboardImportPath) {
    return {
        uploadGrafanaDashboard: function(dashboardName, fqdns) {
            //TODO: Replace dashboard JSON fqdns with those passed in as an arg
            //TODO: Determine why we receive 404 here
            var dashboardJSON = require(`../../dashboards/${dashboardName}_dashboard.json`);
            var postPayload = {
                body: {
                    dashboard: dashboardJSON,
                    overwrite: false
                },
                json: true
            }
            return authedRestClient.post(grafanaDashboardImportPath, postPayload);
        }
    }
}