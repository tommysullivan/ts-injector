module.exports = function() {
    this.When(/^I ask for a link to the following applications:$/, function (table, callback) {
        var applicationNames = this.getArrayFromTable(table);
        console.log('applicationNames', JSON.stringify(applicationNames));
        this.retrievedApplicationLinks = []
        this.api.newGroupPromise(applicationNames.map(applicationName=>{
            return this.authenticatedMCSSession.applicationLinkFor(applicationName).then(
                url => this.retrievedApplicationLinks.push({
                    applicationName: applicationName,
                    url: url
                }),
                error => callback(error)
            );
        })).done(
            links => callback(),
            error => callback(error)
        );
    });

    this.Then(/^I receive a URL for each application$/, function (callback) {
        var badLinks = this.retrievedApplicationLinks.filter(
            appLink => !this.api.newURLValidator().isUri(appLink.url)
        );
        if(badLinks.length > 0) callback('one or more bad links: '+JSON.stringify(badLinks));
        else callback();
    });

    this.Given(/^a GET request of each URL does not return an error status code$/, function () {
        return this.api.newGroupPromise(this.retrievedApplicationLinks.map(
            link => this.api.newRestClientAsPromised().get(link.url)
        ));
    });
}