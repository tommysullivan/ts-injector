module.exports = function() {
    this.When(/^I run the Spyglass installer$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I subsequently run the health check described by "([^"]*)"$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^the health check passes$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have installed Spyglass onto "([^"]*)"$/, function (operatingSystem, callback) {
        if(operatingSystem=='CentOS 7') {
            this.grafanaHostAndOptionalPort = 'http://10.10.1.103:3000';
            callback();
        }
        else callback.pending();
    });

}