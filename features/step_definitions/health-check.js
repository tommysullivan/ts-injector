module.exports = function() {

    this.Given(/^my MCS username is "([^"]*)"$/, function (mcsUserName) {
        this.mcsUserName = mcsUserName;
    });

    this.Given(/^my MCS password is "([^"]*)"$/, function (mcsPassword) {
        this.mcsPassword = mcsPassword;
    });

    this.Given(/^I have an authenticated MCS Rest Client Session$/, function (callback) {
        this.createInstallerRestSession()
            .then(installerRestSession => installerRestSession.services())
            .then(services => {
                var mcsHost = services.mcs().hosts[0];
                var mcsUrl = `https://${mcsHost}:8443`;
                return this.api.newMCSRestClient(mcsUrl)
                    .createAutheticatedSession(this.mcsUserName, this.mcsPassword)
            })
            .done(
                authenticatedMCSSession => {
                    this.authenticatedMCSSession = authenticatedMCSSession;
                    callback()
                },
                error => callback(error.toString())
            );
    });

    this.Given(/^I use the MCS Rest Client Session to retrieve dashboardInfo$/, function (callback) {
        this.authenticatedMCSSession.dashboardInfo()
            .done(
                dashboardInfo => { this.dashboardInfo = dashboardInfo; callback() },
                error=>callback(error.toString())
            );
    });

    this.When(/^I ask the dashboardInfo for unhealthySpyglassServices$/, function () {
        this.unhealthySpyglassServices = this.dashboardInfo.unhealthySpyglassServices();
    });

    this.Then(/^I do not see any unhealthy spyglass services$/, function (callback) {
        if(this.unhealthySpyglassServices.length > 0) callback("Unhealthy services: "+JSON.stringify(this.unhealthySpyglassServices));
        else callback();
    });

    this.When(/^I purposely take down (.*) on one or more nodes$/, function (service, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^I see that (.*) is in the list within "([^"]*)" seconds$/, function (arg1, service, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });
}