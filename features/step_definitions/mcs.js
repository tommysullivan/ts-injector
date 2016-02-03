module.exports = function() {
    this.Given(/^my MCS username is "([^"]*)"$/, function (mcsUserName) {
        this.mcsUserName = mcsUserName;
    });

    this.Given(/^my MCS password is "([^"]*)"$/, function (mcsPassword) {
        this.mcsPassword = mcsPassword;
    });

    this.Given(/^my MCS is running at "([^"]*)"$/, function (mcsProtocolHostAndOptionalPort) {
        this.mcsProtocolHostAndOptionalPort = mcsProtocolHostAndOptionalPort;
    });

    this.Given(/^I have an authenticated MCS Rest Client Session$/, function (callback) {
        var self = this;
        this.api.newMCSRestClient(this.mcsProtocolHostAndOptionalPort).createAutheticatedSession(this.mcsUserName, this.mcsPassword).done(
            function(authenticatedMCSSession) { self.authenticatedMCSSession = authenticatedMCSSession; callback() },
            function(error) { callback(error); }
        );
    });

    this.Given(/^I use the session to retrieve dashboardInfo$/, function (callback) {
        var self = this;
        this.authenticatedMCSSession.dashboardInfo().done(
            function(dashboardInfo) { self.dashboardInfo = dashboardInfo; callback() },
            function(error) { callback(error); }
        );
    });

    this.When(/^I ask the dashboardInfo for unhealthySpyglassServices$/, function () {
        this.unhealthySpyglassServices = this.dashboardInfo.unhealthySpyglassServices();
    });

    this.Then(/^I do not see any unhealthy spyglass services$/, function (callback) {
        if(this.unhealthySpyglassServices.length > 0) callback("Unhealthy services: "+JSON.stringify(this.unhealthySpyglassServices));
    });

}