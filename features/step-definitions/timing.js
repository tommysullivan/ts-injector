module.exports = function() {
    this.When(/^I wait "([^"]*)" seconds$/, { timeout: 10 * 1000 * 60 }, function (numSeconds, callback) {
        setTimeout(callback, numSeconds * 1000);
    });
};