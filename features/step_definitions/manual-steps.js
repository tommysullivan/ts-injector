module.exports = function() {
    this.When(/^I read the readme at "([^"]*)"$/, function (readmeURL) {});
    this.Then(/^it tells me how to install, configure and run the services required for Spyglass$/, function () {});
    this.Given(/^it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch$/, function () {});
    this.Given(/^I have manually prepared a single node cluster as described by "([^"]*)"$/, function (featureFilePath) {

        //use case 1
        //  the english sentence above is enough to describe the step.
        //
        //use case 2
        //  we want to add explicit manual steps underneath this step.
        //
        //solution design:
        //  for any step (top level or created child step)
        //  add an "expected, got"
        //  add a simple checkbox to indicate whether the step could be successfully performeded

        //what about chains of tests?
        //  We can

        //all steps have at least one textbox which can store details
        //this.cucumberStep().isManual(); //uses a pass/fail checkbox
        //this.cucumberStep().isManual().withExpectedResultOf(5).fromAmongPossibleValues(1,2,3,4,5); //without fromAmongPossibleValues it would be a textbox and a checkbox. withCheckbox
        //this.cucumberStep().hasTheseManualSteps(
        //    this.newManualStep('navigate to '+featureFilePath)
        //    this.newManualStep('go to the whatever').
        //    }
        //)

        //TODO: Generate HTML version of test results that can be easily viewed
        //let's start here. If we did this, we would save the HTML with embedded JSON to disk so it could be viewable as a jenkins artifact.
        //find library

        //TODO: Generate Manual Test Plan that can be easily updated and saved to JSON.
        // what would this look like?
        // it would have the cucumber html but then with possible manual steps underneath and html controls that would update the JSON, turning the words green, red, gray, etc based on if the conditions were correct.
        // we could save the HTML with embedded JSON as well as the plain JSON to either disk or auto-commit to git.



        //simplest api is to say isManual() and hasTheseManualSteps('step', 'step2', ...)
        //start a local http server and output it.
        //the json files can just be stored in a folder on the local computer and committed by hand.
        //we could even have an automated way to update a certain commit with its corresponding test results from the web UI.

        //run this and configure it to hit the Spyglass Test Portal. Which could be a stateless express server
        //that will store the JSON for the manual test description and then render an HTML web app that can
        //use REST to interact with the portal to update the state of the document.

        //it could store it using MapRDB, git, or any othe RESTful JSON store. In fact, it need not store it at all,
        //it can simply be "saved" to the testers computer and then put wherever or viewed.


        console.log('feature='+this.feature.getName());
        console.log('scenario='+this.scenario.getName());
        console.log('step='+this.step.getName());
        console.log('tags='+this.tags.map(function(tag) { return tag.getName(); }));
    });

    this.Given(/^it has been populated with reports as described in "([^"]*)"$/, function (arg1) {});
    this.Given(/^I have logged into Grafana$/, function () {});
    this.When(/^I navigate to the node dashboard$/, function () {});
    this.When(/^I look for the following metrics$/, function (table) {});
    this.Then(/^I see the corresponding graph with reasonably accurate data for the past (\d+) hours$/, function (arg1) {});

    this.Given(/^I have a kibana instance running at "([^"]*)"$/, function (arg1) {});
    this.When(/^I navigate to kibana's discovery interface$/, function () {});
    this.Then(/^I see at least one log from warden$/, function () {});
}