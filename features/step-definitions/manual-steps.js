module.exports = function() {
    function manualStep(numParameters) {
        var handlers = {
            0: function() {
                //callback.pending();
            },
            1: function(a) {
                //callback.pending();
            },
            2: function(a,b) {
                //callback.pending();
            }
        };
        return handlers[numParameters];
    }
    this.Given(/^I am viewing a test result in test portal$/, manualStep(0));
    this.When(/^I click "([^"]*)"$/, manualStep(1));
    this.Then(/^it updates tagged JIRA issues with test result statuses$/, manualStep(0));
    this.Given(/^I have marked a Scenario with the @Manual tag$/, manualStep(0));
    this.Given(/^I have run bin\/run\-end\-to\-end\-tests against some @Manual and some automated tests$/, manualStep(0));
    this.Given(/^the CI Server is running$/, manualStep(0));
    this.When(/^I view the result in the CI Server$/, manualStep(0));
    this.Then(/^I can see the automated test results in a hierarchical view$/,manualStep(0));
    this.Then(/^the manual steps are editable and in a "([^"]*)" state$/, manualStep(1));
    this.Given(/^I have changed manual test results$/, manualStep(0));
    this.Then(/^I am notified that the save has succeeded$/, manualStep(0));
    this.Then(/^if I navigate to the Test Result Explorer$/, manualStep(0));
    this.Then(/^click back into the previously saved test result$/, manualStep(0));
    this.Then(/^I see it has retained my changes$/, manualStep(0));
    this.Given(/^I am viewing a Test Result or the Test Result Explorer$/, manualStep(0));
    this.When(/^I type in "([^"]*)"$/, manualStep(1));
    this.Then(/^the view updates to only show features \/ scenarios tagged with either @tag(\d+) or @tag(\d+)$/, manualStep(2));
    this.Then(/^I also see items that do not have @tag(\d+)$/, manualStep(1));
    this.Then(/^all the charts and summaries and statuses update to reflect the filtered view of the test$/,manualStep(0));
    this.When(/^I change the filter to "([^"]*)"$/, manualStep(1));
    this.Then(/^I only see the manual tests$/, manualStep(0));
    this.Then(/^I only see the automated tests$/, manualStep(0));
    this.Then(/^I can see both automated and manual tests$/, manualStep(0));
    this.Given(/^I have some tests that are not associated with a JIRA ticket$/, manualStep(0));
    this.When(/^I check "([^"]*)"$/, manualStep(1));
    this.Then(/^I only see those features \/ scenarios that have no JIRA ticket$/, manualStep(0));
    this.Given(/^I have tests with various statuses$/, manualStep(0));
    this.When(/^I check and uncheck the statuses in the upper right$/, manualStep(0));
    this.Then(/^the view and charts update to reflect only the subset of features \/ scenarios with the matching statuses$/, manualStep(0));
    this.Given(/^I have tested a JQL Query using JIRA and know it to work$/, manualStep(0));
    this.When(/^I paste that JQL query into the JQL text input$/, manualStep(0));
    this.Then(/^the view filters to show only those tickets which are associated with the JIRA tickets in the JQL result$/, manualStep(0));
    this.When(/^I search for tags directly by typing them or indirectly via JQL that have no test cases$/, manualStep(0));
    this.Then(/^I see a warning indicating how many tags were found \/ not found \/ sought$/, manualStep(0));
    this.Then(/^I see the names of the tags that were not found$/, manualStep(0));
    this.Given(/^I have some scenarios with a @SPYG\-XXX tag$/, manualStep(0));
    this.When(/^I click said tag name where it appears$/, manualStep(0));
    this.Then(/^I am taken to the JIRA ticket page for that tag$/, manualStep(0));
    this.Given(/^I have an up to date test result with some scenarios with @SPYG\-XXX JIRA tags$/, manualStep(0));
    this.Then(/^I am notified that the results have been synced$/, manualStep(0));
    this.Then(/^when I view the JIRA ticket\(s\) that should have been updated$/, manualStep(0));
    this.Then(/^I see comments in each ticket summing up the status of that ticket's test$/, manualStep(0));
    this.Then(/^I see summaries of scenarios, features and steps passed \/ failed \/ pending \/ not exected$/, manualStep(0));
    this.Then(/^I see a link that takes me to the CI Portal displaying just that story's results using pre\-filtered query$/, manualStep(0));
    this.Given(/^I want to publish a test result from my local computer to the CI server$/, manualStep(0));
    this.When(/^I do an HTTP PUT to ci\-server\-host\/test\-results\/my\-test\-result\-name\-here$/, manualStep(0));
    this.Then(/^I receive a (\d+) OK$/, manualStep(1));
    this.Then(/^I see the test result in the Test Result Explorer$/, manualStep(0));
    this.Then(/^I can open and view the test$/,manualStep(0));
    this.When(/^I follow the manual installation instructions located at "([^"]*)"$/, manualStep(1));
    this.Then(/^it tells me how to install, configure and run the services required for Spyglass$/, manualStep(0));
    this.Given(/^it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch$/, manualStep(0));
    this.Given(/^it has been populated with reports as described in "([^"]*)"$/, manualStep(1));
    this.Given(/^I have logged into Grafana$/, manualStep(0));
    this.When(/^I navigate to the node dashboard$/, manualStep(0));
    this.When(/^I look for the following metrics$/, manualStep(1));
    this.Then(/^I see the corresponding graph with reasonably accurate data for the past (\d+) hours$/, manualStep(1));
    this.When(/^I navigate to kibana's discovery interface$/, manualStep(0));
    this.Then(/^I see at least one log from warden$/, manualStep(0));
    this.Given(/^I have determined the kibana server and port for that cluster$/, manualStep(0));
    this.Given(/^I can authenticate my browser using the GUI Installer Login Page$/, manualStep(0));
    this.When(/^I indicate I want a basic installation with Spyglass components and their dependencies only$/, manualStep(0));
    this.Then(/^the website indicates that the installation succeeds within "([^"]*)" minutes$/, manualStep(1));
}