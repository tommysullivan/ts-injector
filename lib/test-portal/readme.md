# CI Server

This is the CI server for Spyglass, which is intended to graduate to its own repository
and become owned by DevOps as a general purpose tool if it turns out to be a successful initiative.

## How to Use

### Installation

From the root directory, assuming you have a newer version of node.js:

    npm install
    
Next, client side dependencies must be installed. From the lib/test-portal directory:

    bower install
    
### Run the CI Server

Run the server with nodemon if you desire auto restart upon server source code change. Else skip word "nodemon":

    hostName=[localhost] testPortalPort=[5001] jiraUsername=[your username] jiraPassword=[your password] \
    nodemon bin/run-test-portal
 
Note, JIRA credentials may be omitted unless you intend to use JIRA syncing capabilities of the CI server.

### Use the QA Hosted version of CI Server

QA is running a copy of the CI server [here](http://10.10.1.101/).

## REST API

### Trigger a Test Run remotely

You cannot trigger a test run remotely at the moment.
 
### Add locally generated test result to CI Server

    curl -vX PUT http://10.10.1.101/test-results/your-test-result-file.json -d @your-test-result-file.json
    
### Retrieve all Test Results from CI Server

The following curl command will retrieve a list of the results, modified date, name, and href to the result details.

    curl http://10.10.1.101/test-results/

### Retrieve a Specific Test Result Detail

    curl http://10.10.1.101/test-results/[test-result-id]
    
This will return a JSON with the test result information. To obtain a test-result-id it is recommended first to call
to get "all test results from CI Server" and follow the href of the desired result.

## Potential Future Enhancements

### Web UI

Finding Test Results

    - Ability to filter by date range
    - Ability to share the query bar state as user navigates to different pages
    - Ability to save, load and use common query descriptions
    - Deep Linking reflects current query and position within view
    - Use a Drill + Visualization tool to view results over time as a chart
    - Ability to searchably tag at the "entire test result" level

Exploring a Test Result

    - Indicate the sought tags for which there was not a match
    - Ability to view/explore the full test configuration for a run
    - ability to expand and collapse the hierarchy
    - Visualize the individual test result as a chart using Drill + Visualization 
    - Ability to AND tags as well as OR them
    - Ability to GROUP ands and ors to arbitrary depth (wait until use case)

Loading / Saving of Single Test Result File 

    - Ability to change the test result names (workaround: change file names on filesystem)
    - Ability to POST a result from a running test job, such as Jenkins, and get its URL (workaround: use PUT to known URL)
    - Maybe: Borrow from Tommy's Universe a simple import and export JSON mechanism that uses browser client only (no save)

Attachments

    - Ability to attach, automatically or during manual testing, supporting test data

Manual Testing

    - Enable optional comments for any step or scenario
    - Enable attachments
    - Ability to use a DSL to specify more granular manual steps beyond the Gherkin (deferred - just write more detailed gherkin)

Running a Test
    
    - Ability to run new test (hardcoded at first) with web UI (workaround: run test locally and PUT it to the server or view in local server)
    - Ability to vary configuration from web UI
    - Can view current local gherkin test "dry run" and then click "Run" to run. Redirects to test result with "Refresh" button.
    - Can check which scenarios you want to run manually (they start off as all selected) - gotcha: scenario outlines?
    - Add "select / deselect all visible scenarios"
    - Auto-Refresh
    - Web Sockets instead of Auto-Refresh
    
### Execution Engine

Configuration

    - Ability to override configuration particulars, especially host names.
    - Ability to indicate "dependencies between tests"
    - TestRun Configuration tied to Test Result - enables guaranteed recreation of test result
        - Cluster Under Test configurations used in one or more tests can be used to recreate those from scratch
        - Other Test Configuration

### Integration

JIRA Integration

    - Update JIRA issues with test result status and summary for a given result
    - JQL Query auto applies tag query to currently viewed test result
    - tags can link to the JIRA issues they are associated with
    - Identify JIRA tickets that do not have commit records on them
    - Identify JIRA tickets that do not have a corresponding test (just do a query and refer to the number of unfound tags)
    
GitHub Integration

    - Show commit links associated with a given scenario based on its JIRA tags
    - Pull test specification from particular github repo, branch, commit
    - Update github with test results

Google Sheets Integration

    - Establish way to map from Google Sheet to the Cucumber Case (just use tag nomenclature)
    - Link Google sheet test cases to most recent test result viewer (with preapplied filter
    - Link Google sheet to the most recent test result viewer (with no preapplied filters)
    - Show pass/fail in Google sheet via Test Portal REST API?
    
REST Interface

    - Make the JSON and UI urls for test results the same, redirect to client side url from server
      if content-type is text/html, serve JSON if application/json or vnd.*+json
    
### Framework
    
    - Enable injectable javascript code to be shared between client and server side
    - Use lazy compositions of filter predicates if it improves performance
    - Look into using TypeScript
    - Look into using webpack
    - Look into using lodash
    - REST discoverability / self-documentation
    - Get the thing onto MapRDB, then use a web based drill client to visualize the data
        - NOTE: Wanted to use the node bindings, but saw that it requires to couple to
        - python, C, C++ and Java (as well as node). Would prefer not having that complexity.
        - Will look into it later.
    
## Bugs

    - No known bugs at this time
    
## CI/CD
    
Testing

    - As the system gets more complex, it itself neds tests. 
    
Pipeline

    - This system can go through the pipeline which it itself is a part of and can actually be 
      an internal team dogfooding of how well our pipeline is working based on how well this project goes
      through it.