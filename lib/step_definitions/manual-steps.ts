import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    this.Given(/^I the local destination file already exists$/, () => {});
    this.Given(/^I am viewing a test result in test portal$/, () => {});
    this.Given(/^it updates tagged JIRA issues with test result statuses$/, () => {});
    this.Given(/^I have marked a Scenario with the @Manual tag$/, () => {});
    this.Given(/^I have run bin\/run\-end\-to\-end\-tests against some @Manual and some automated tests$/, () => {});
    this.Given(/^the CI Server is running$/, () => {});
    this.Given(/^I view the result in the CI Server$/, () => {});
    this.Given(/^I can see the automated test results in a hierarchical view$/, () => {});
    this.Given(/^I have changed manual test results$/, () => {});
    this.Given(/^I am notified that the save has succeeded$/, () => {});
    this.Given(/^if I navigate to the Test Result Explorer$/, () => {});
    this.Given(/^click back into the previously saved test result$/, () => {});
    this.Given(/^I see it has retained my changes$/, () => {});
    this.Given(/^I am viewing a Test Result or the Test Result Explorer$/, () => {});
    this.Given(/^all the charts and summaries and statuses update to reflect the filtered view of the test$/, () => {});
    this.Given(/^I want to make sure the health check is accurate$/, () => {});
    this.Given(/^I only see the manual tests$/, () => {});
    this.Given(/^I only see the automated tests$/, () => {});
    this.Given(/^I can see both automated and manual tests$/, () => {});
    this.Given(/^I have some tests that are not associated with a JIRA ticket$/, () => {});
    this.Given(/^I only see those features \/ scenarios that have no JIRA ticket$/, () => {});
    this.Given(/^I have tests with various statuses$/, () => {});
    this.Given(/^I check and uncheck the statuses in the upper right$/, () => {});
    this.Given(/^the view and charts update to reflect only the subset of features \/ scenarios with the matching statuses$/, () => {});
    this.Given(/^I have tested a JQL Query using JIRA and know it to work$/, () => {});
    this.Given(/^I paste that JQL query into the JQL text input$/, () => {});
    this.Given(/^the view filters to show only those tickets which are associated with the JIRA tickets in the JQL result$/, () => {});
    this.Given(/^I search for tags directly by typing them or indirectly via JQL that have no test cases$/, () => {});
    this.Given(/^I see a warning indicating how many tags were found \/ not found \/ sought$/, () => {});
    this.Given(/^I see the names of the tags that were not found$/, () => {});
    this.Given(/^I have some scenarios with a @SPYG\-XXX tag$/, () => {});
    this.Given(/^I click said tag name where it appears$/, () => {});
    this.Given(/^I am taken to the JIRA ticket page for that tag$/, () => {});
    this.Given(/^I have an up to date test result with some scenarios with @SPYG\-XXX JIRA tags$/, () => {});
    this.Given(/^I am notified that the results have been synced$/, () => {});
    this.Given(/^when I view the JIRA ticket\(s\) that should have been updated$/, () => {});
    this.Given(/^I see comments in each ticket summing up the status of that ticket's test$/, () => {});
    this.Given(/^I see summaries of scenarios, features and steps passed \/ failed \/ pending \/ not exected$/, () => {});
    this.Given(/^I see a link that takes me to the CI Portal displaying just that story's results using pre\-filtered query$/, () => {});
    this.Given(/^I want to publish a test result from my local computer to the CI server$/, () => {});
    this.Given(/^I do an HTTP PUT to ci\-server\-host\/test\-results\/my\-test\-result\-name\-here$/, () => {});
    this.Given(/^I see the test result in the Test Result Explorer$/, () => {});
    this.Given(/^I can open and view the test$/, () => {});
    this.Given(/^it tells me how to install, configure and run the services required for Spyglass$/, () => {});
    this.Given(/^it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch$/, () => {});
    this.Given(/^I have logged into Grafana$/, () => {});
    this.Given(/^I navigate to the node dashboard$/, () => {});
    this.Given(/^I navigate to kibana's discovery interface$/, () => {});
    this.Given(/^I see at least one log from warden$/, () => {});
    this.Given(/^I have determined the kibana server and port for that cluster$/, () => {});
    this.Given(/^I can authenticate my browser using the GUI Installer Login Page$/, () => {});
    this.Given(/^I indicate I want a basic installation with Spyglass components and their dependencies only$/, () => {});
    this.Given(/^I have determined the grafana server and port for that cluster$/, () => {});
    this.Given(/^the GUI Installer web server is running$/, () => {});
    this.Given(/^I have a manual scenario$/, () => {});
    this.When(/^I view it in the portal$/, () => {});
    this.Then(/^it works as described in the portal requirements and tests$/, () => {});
    function manualStep0():string { return 'pending'; }

    this.When(/^I click "([^"]*)"$/, () => {});
    this.Given(/^the manual steps are editable and in a "([^"]*)" state$/, () => {});
    this.Given(/^I type in "([^"]*)"$/, () => {});
    this.Given(/^I also see items that do not have @tag(\d+)$/, () => {});
    this.Given(/^I change the filter to "([^"]*)"$/, () => {});
    this.Given(/^I check "([^"]*)"$/, () => {});
    this.Given(/^I receive a (\d+) OK$/, () => {});
    this.Given(/^I follow the manual installation instructions located at "([^"]*)"$/, () => {});
    this.Given(/^it has been populated with reports as described in "([^"]*)"$/, () => {});
    this.Given(/^I look for the following metrics$/, () => {});
    this.Given(/^I see the corresponding graph with reasonably accurate data for the past (\d+) hours$/, () => {});
    this.Given(/^the website indicates that the installation succeeds within "([^"]*)" minutes$/, () => {});
    this.Given(/^my grafana username is "([^"]*)"$/, () => {});
    this.Given(/^my grafana password is "([^"]*)"$/, () => {});
    function manualStep1(arg1:any):string { return 'pending'; }

    this.Given(/^the view updates to only show features \/ scenarios tagged with either @tag(\d+) or @tag(\d+)$/, () => {});
    function manualStep2(arg1:any, arg2:any):string { return 'pending'; }

};