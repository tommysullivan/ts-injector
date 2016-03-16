# CI Server

This is the CI server for Spyglass, which is intended to graduate to its own repository
and become owned by DevOps as a general purpose tool if it turns out to be a successful initiative.

## How to Use

### Installation

From the root directory, assuming you have a newer version of node.js:

    npm install
    
Next, client side dependencies must be installed. From the lib/test-portal/static-web-content directory:

    bower install --allow-root
    
### Run the CI Server

Run the server with nodemon if you desire auto restart upon server source code change. Else skip word "nodemon":

    hostName=[localhost] testPortalPort=[5001] jiraUsername=[your username] jiraPassword=[your password] \
    nodemon bin/run-test-portal
 
Note, JIRA credentials may be omitted unless you intend to use JIRA syncing capabilities of the CI server.

### Use the QA Hosted version of CI Server

QA is running a copy of the CI server [here](http://testing.devops.lab/). There is a 
[Jenkins Health Check](http://10.10.1.153:8080/job/test-portal-health-check/) monitoring
job that runs every 10 minutes and emails tsullivan@maprtech.com upon failure.

## REST API

### Trigger a Test Run remotely

You cannot trigger a test run remotely at the moment.
 
### Add locally generated test result to CI Server

    curl -H 'Content-Type: application/json' -vX PUT http://testing.devops.lab/test-results/your-test-result-file -d @your-test-result-file.json
    
### Retrieve all Test Results from CI Server

The following curl command will retrieve a list of the results, modified date, name, and href to the result details.

    curl http://testing.devops.lab/test-results/

### Retrieve a Specific Test Result Detail

    curl http://testing.devops.lab/test-results/[test-result-id]
    
This will return a JSON with the test result information. To obtain a test-result-id it is recommended first to call
to get "all test results from CI Server" and follow the href of the desired result.

## Potential Future Enhancements

### Web UI

Finding Test Results

    - Ability to filter by date range
    - Ability to zoom in and out for given date range (instead of showing too many squished together)
    - Ability to share the query bar state as user navigates to different pages
    - Ability to save, load and use common query descriptions
    - Deep Linking reflects current query and position within view
    - Use a Drill + Visualization tool to view results over time as a chart
    - Ability to searchably tag at the "entire test result" level
    - Ability to search by cluster characteristics (such as version or environment)
    - Ability to search by configuration predicates (with cli args becoming configuration as well)
    - Ability to search by version of test code
    - Ability to link tests together with a unique "test session id"

Exploring a Test Result

    - scenario outline output could be grouped better
    - see related test run(s) against different environment
    - need way to navigate quickly to source of failing tests
    - Indicate the sought tags for which there was not a match
    - Ability to view/explore the full test configuration for a run
    - ability to expand and collapse the hierarchy
    - Visualize the individual test result as a chart using Drill + Visualization 
    - Ability to AND tags as well as OR them
    - Ability to GROUP ands and ors to arbitrary depth (wait until use case)
    - Ability to view details of a step denoted by tripe quotes """

Loading / Saving of Single Test Result File 

    - Ability to change the test result names (workaround: change file names on filesystem)
    - Ability to POST a result from a running test job, such as Jenkins, and get its URL (workaround: use PUT to known URL)
    - Maybe: Borrow from Tommy's Universe a simple import and export JSON mechanism that uses browser client only (no save)

Manual Testing

    - Enable optional comments for any step or scenario
    - Ability to use a DSL to specify more granular manual steps beyond the Gherkin (deferred - just write more detailed gherkin)

Running a Test

    - Ability to run against multiple clusters in parallel within one process
    - Ability to specify the "Cluster Under Test" for a given test run
    - Ability to attach, automatically or during manual testing, supporting test data    
    - Ability to run new test (hardcoded at first) with web UI (workaround: run test locally and PUT it to the server or view in local server)
    - Ability to vary configuration from web UI
    - Can view current local gherkin test "dry run" and then click "Run" to run. Redirects to test result with "Refresh" button.
    - Can check which scenarios you want to run manually (they start off as all selected) - gotcha: scenario outlines?
    - Add "select / deselect all visible scenarios"
    - Auto-Refresh
    - Web Sockets instead of Auto-Refresh
    
## Authoring a Test

    - Ability to indicate "dependencies between tests"
    - Ability to indicate "do nothing step" that should be automated but is not pending because it is not critical

### Integration

JIRA Integration

    - Change Story Card Workflow states based on test results
    - JQL Query stays when navigating between Result Set and Individual Test Run
    - Identify JIRA tickets that do not have commit records on them
    
GitHub Integration

    - Show commit links associated with a given scenario based on its JIRA tags
    - Pull test specification from particular github repo, branch, commit
    - Update github with test results

Google Sheets Integration

    - Establish way to map from Google Sheet to the Cucumber Case (just use tag nomenclature)
    - Link Google sheet test cases to most recent test result viewer (with preapplied filter
    - Link Google sheet to the most recent test result viewer (with no preapplied filters)
    - Show pass/fail in Google sheet via Test Portal REST API?
    
IntelliJ Integration
    
    - Cucumber IntelliJ plugin does not allow debugging
    
REST Interface

    - Make the JSON and UI urls for test results the same, redirect to client side url from server
      if content-type is text/html, serve JSON if application/json or vnd.*+json
    
### Framework
    
    - Enable injectable javascript code to be shared between client and server side
    - Enable "Cascading Configuration" rather than single JSON file (multiple config JSONs layered atop eachother)
    - Wrap execution of Cucumber (call Cucumber via API) - enabling nested, dependent, and parallel invocations
    - Enable invocation of ATS / JUnit Tests (via Jenkins / REST, language bindings, or CLI)
    - Use lazy compositions of filter predicates if it improves performance
    - Look into using TypeScript, Scala, Java, CoffeeScript, Ruby, other languages
    - Look into using webpack
    - Look into using lodash
    - REST discoverability / self-documentation
    - Get the thing onto MapRDB, then use a web based drill client to visualize the data
        - NOTE: Wanted to use the node bindings, but saw that it requires to couple to
        - python, C, C++ and Java (as well as node). Would prefer not having that complexity.
        - Will look into it later.
    
## Bugs

    - Safari browser has errors due to lack of EcmaScript 6 support (requires recompile)
    
## CI/CD
    
Testing

    - As the system gets more complex, it itself neds tests. 
    
Pipeline

    - This system can go through the pipeline which it itself is a part of and can actually be 
      an internal team dogfooding of how well our pipeline is working based on how well this project goes
      through it.