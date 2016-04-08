//this.Given(/^I have an authenticated grafana rest client$/, function (callback) {
//    callback.pending();
//    //TODO: Discover grafana url
//    //this.grafanaRestClient.createAutheticatedSession(this.grafanaUsername, this.grafanaPassword).done(
//    //    grafanaRestSession => { this.grafanaRestSession = grafanaRestSession; callback(); },
//    //    callback
//    //);
//});
//
//this.When(/^I request to import the following dashboard definitions:$/, function (table, callback) {
//    var dashboardNames = this.getArrayFromTable(table);
//    var uploadPromises = dashboardNames.map(dashboardName => this.grafanaRestSession.uploadGrafanaDashboard(dashboardName, this.fqdns));
//    var allPromises = this.api.newGroupPromise(uploadPromises);
//    allPromises.done(
//        (results) => {
//            this.dashboardUploadResults = results;
//            callback();
//        },
//        failedResponse => callback(failedResponse.toString())
//    );
//});
//
//this.Then(/^the reports are all available to view$/, function (callback) {
//    callback(this.dashboardUploadResults);
//    callback.pending();
//});