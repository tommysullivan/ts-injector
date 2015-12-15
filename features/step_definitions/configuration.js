module.exports = function() {
    this.Given(/^I have configured (.*) collection to be (.*) for a (.*)$/, function (metricsOrLogs, onOrOff, typeOfProducer, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I view (.*) for that (.*) during the period for which it was (.*)$/, function (metricsOrLogs, typeOfProducer, onOrOff, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^I (.*) any (.*) for that (.*)$/, function (seeOrDonTSee, metricsOrLogs, typeOfProducer, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^the change takes effect within "([^"]*)" seconds$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have configured (.*) retention period to be (.*) for a (.*)$/, function (metricsOrLogs, periodOfTime, typeOfProducer, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^sufficient time passes for the retention period to have expired$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^I see that the (.*) were deleted from the filesystem and (.*)$/, function (metricsOrLogs, indexedDataLocation, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have logging configuration:$/, function (string, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^the following log is written:$/, function (string, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^the following is sent to elasticsearch:$/, function (string, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I am using "([^"]*)" of the GUI installer$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I arrive at the component selection$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^I can select "([^"]*)" as a component$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^These may be named generically ie "([^"]*)" and "([^"]*)"$/, function (arg1, arg2, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^These may be named using implementation detail component names ie "([^"]*)" and "([^"]*)"$/, function (arg1, arg2, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^There may be constraints on where these live, which would need to be implemented server and\/or client side$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });
}