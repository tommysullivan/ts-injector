module.exports = function() {
    function getArrayFromTable(table) {
        return table.rows().map(function(i) { return i[0]; });
    }

    this.Given(/^I have installed Spyglass$/, function (callback) {
        this.api.newSpyglassInstaller().install().done(function(installedSpyglassSystem) {
            this.installedSpyglassSystem = installedSpyglassSystem;
            callback();
        }, callback);
    });

    this.Given(/^I restrict myself to a single node cluster running one the following Operating Systems:$/, function (table) {
        this.operatingSystems = getArrayFromTable(table);
    });

    this.Given(/^I restrict that node to run in one of the following ways:$/, function (table) {
        this.hardwareTypes = getArrayFromTable(table);
    });

    this.Given(/^I have a Spyglass\-enabled Cluster \(IPs specified in configuration\)$/, function (callback) {
        //var restClient = this.api.newRestClientAsPromised('http://cnn.com');
        //return restClient.get('/').done(function() {
        //    callback();
        //}, function(error) { callback(error); });
    });

    this.Given(/^I have discovered the url for Zookeeper REST service$/, function (callback) {

        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^the following services are put into an arbitrary combination of "([^"]*)" or "([^"]*)" state$/, function (arg1, arg2, table, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I query any Zookeeper's REST Service for health of said services$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^Zookeeper's answers on the health of said services are consistent with my expectations$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^if this does not happen right away, it should happen within "([^"]*)" seconds at most$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I am a MapR Employee$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I want to install MapR Core, YARN and Spyglass for Testing or Demo Purposes$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I navigate to "([^"]*)"$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^I will find instructions that enable me, without any advanced knowledge, to:$/, function (table, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I clone the "([^"]*)" repo$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I run the "([^"]*)" script with appropriate config \/ CLI options$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^it will install spyglass in the desired way$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^it will run the Post\-Install Health Check$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

}