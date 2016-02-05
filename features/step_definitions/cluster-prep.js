module.exports = function() {

    this.Given(/^the node is running (.*) (.*)$/, function (operatingSystem, version, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have automatically prepared a single node cluster as described by "([^"]*)"$/, function (featureFilePath, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I prepare it using automation described by "([^"]*)"$/, function (featureFilePath, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

}