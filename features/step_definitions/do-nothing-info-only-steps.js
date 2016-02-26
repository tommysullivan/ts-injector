module.exports = function() {
    this.Given(/^I want to make sure the health check is accurate$/, function (callback) { callback.pending(); });
    this.Given(/^the cluster under test is a single node cluster$/, function () {});
    this.Then(/^those values may be incorrect but we are only testing for presence$/, function () {});
}