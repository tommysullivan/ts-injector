module.exports = function() {
    this.When(/^I read the readme at "([^"]*)"$/, function (readmeURL) {});
    this.Then(/^it tells me how to install, configure and run the services required for Spyglass$/, function () {});
    this.Given(/^it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch$/, function () {});
    this.Given(/^I have manually prepared a single node cluster as described by "([^"]*)"$/, function (featureFilePath) {});
}