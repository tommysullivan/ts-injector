module.exports = function() {
    this.When(/^I wait "([^"]*)" seconds$/, function (numSeconds, callback) {
        setTimeout(callback, numSeconds * 1000);
    });
}