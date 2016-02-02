module.exports = function() {
    this.Given(/^I know the URL of MCS$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have a username of "([^"]*)"$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have a password of "([^"]*)"$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I attempt to authenticate to MCS Rest Service$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^I succeed and get a session cookie I can use in future REST API calls$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

}