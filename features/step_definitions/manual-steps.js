module.exports = function() {
    this.When(/^I read the readme at "([^"]*)"$/, function (readmeURL) {});
    this.Then(/^it tells me how to install, configure and run the services required for Spyglass$/, function () {});
    this.Given(/^it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch$/, function () {});
    this.Given(/^I have manually prepared a single node cluster as described by "([^"]*)"$/, function (featureFilePath) {});

    this.Given(/^it has been populated with reports as described in "([^"]*)"$/, function (arg1) {});
    this.Given(/^I have logged into Grafana$/, function () {});
    this.When(/^I navigate to the node dashboard$/, function () {});
    this.When(/^I look for the following metrics$/, function (table) {});
    this.Then(/^I see the corresponding graph with reasonably accurate data for the past (\d+) hours$/, function (arg1) {});
}