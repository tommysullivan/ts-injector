module.exports = function() {
    this.When(/^I ask for a link to (.*)$/, function (applicationName, callback) {
        this.authenticatedMCSSession.applicationLinkFor(applicationName).done(
            applicationURLFromMCS => { this.applicationURLFromMCS = applicationURLFromMCS; callback(); },
            callback
        )
    });

    this.Then(/^I receive a URL to (.*)$/, function (applicationName, callback) {
        if(!this.api.newURLValidator().isUri(this.applicationURLFromMCS)) callback("Invalid URL: "+this.applicationURLFromMCS);
        else callback();
    });

    this.Given(/^a GET request of the URL does not return an error status code$/, function () {
        return this.api.newRestClientAsPromised().get(this.applicationURLFromMCS);
    });
}