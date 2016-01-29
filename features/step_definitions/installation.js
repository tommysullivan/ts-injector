module.exports = function() {
    function getArrayFromTable(table) {
        return table.rows().map(function(i) { return i[0]; });
    }

    this.Given(/^I am a MapR Employee$/, function () {
    });

    this.Given(/^I want to install MapR Core, YARN and Spyglass for Testing or Demo Purposes$/, function () {
    });

    this.Given(/^I restrict myself to a single node cluster running one the following Operating Systems:$/, function (table) {
        this.operatingSystems = getArrayFromTable(table);
        console.log(this.operatingSystems);
    });

    this.Given(/^I restrict that node to run in one of the following ways:$/, function (table) {
        this.runMechanisms = getArrayFromTable(table);
        console.log(this.runMechanisms);
    });

    this.When(/^I navigate to "([^"]*)"$/, function (url) {
        console.log(url);
    });

    this.Then(/^I will find instructions that enable me, without any advanced knowledge, to:$/, function (table, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have installed Spyglass$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I run the Post\-Install Health Check$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^it verifies connectivity to the following services:$/, function (table, callback) {
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