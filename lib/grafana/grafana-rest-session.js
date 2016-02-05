module.exports = function(api, authedRestClient, grafanaDashboardImportPath) {
    return {
        uploadGrafanaDashboard: function(dashboardName, fqdns) {
            return api.newPromise(function(resolve, reject) {
                //TODO: Replace dashboard JSON fqdns with those passed in as an arg
                //TODO: Determine why we receive 404 here
                var dashboardJSON = require('../../dashboards/'+dashboardName+'_dashboard.json');
                authedRestClient.post(
                    grafanaDashboardImportPath,
                    {
                        body: {
                            dashboard: dashboardJSON,
                            overwrite: false
                        },
                        json: true
                    }
                ).done(
                    function(result) {
                        resolve(result);
                    },
                    function(error) {
                        reject(error);
                    }
                )
            });
        }
    }
}