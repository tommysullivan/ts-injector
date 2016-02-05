module.exports = function() {
    this.Given(/^I have a grafana server and port set to "([^"]*)"$/, function (grafanaHostAndOptionalPort) {
        this.grafanaRestClient = this.api.newGrafanaRestClient(grafanaHostAndOptionalPort);
    });

    this.Given(/^my grafana username is "([^"]*)"$/, function (grafanaUsername) {
        this.grafanaUsername = grafanaUsername;
    });

    this.Given(/^my grafana password is "([^"]*)"$/, function (grafanaPassword) {
        this.grafanaPassword = grafanaPassword;
    });

    this.Given(/^I have an authenticated grafana rest client$/, function (callback) {
        var self = this;
        this.grafanaRestClient.createAutheticatedSession(this.grafanaUsername, this.grafanaPassword).done(
            function(grafanaRestSession) {
                self.grafanaRestSession = grafanaRestSession;
                callback();
            },
            callback
        );
    });

    this.Given(/^the fqdns of my cluster are$/, function (table) {
        this.fqdns = this.getArrayFromTable(table);
    });


    this.When(/^I request to import the following dashboard definitions:$/, function (table, callback) {
        var dashboardNames = this.getArrayFromTable(table);
        var self = this;
        var uploadPromises = dashboardNames.map(function(dashboardName) {
            return self.grafanaRestSession.uploadGrafanaDashboard(dashboardName, this.fqdns);
        });
        var allPromises = this.api.newGroupPromise(uploadPromises);
        allPromises.done(
            function(results) {
                self.dashboardUploadResults = results;
                callback();
            },
            function(failedResponse) {
                callback('there was an error - http reponse code:'+failedResponse.statusCode);
            }
        );
    });

    this.Then(/^the reports are all available to view$/, function (callback) {
        callback(this.dashboardUploadResults);
        callback.pending();
    });

}