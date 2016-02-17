# Test Portal

This is temporarily living in Spyglass repository but after it is mature, used, and proven valuable, assuming
that occurs, it can be extracted into its own repo.

Spyglass Specifics

    - Rewrite the Installation / Configuration tab of the test plan into Gherkin and use Sheets Integration above.
    - Link google docs to the tests

## For Thursday's Standup, what would I like to have as my status update?

- Can navigate to a URL and see a list of test results with the current pass/fail and summary
- Can view a given result
- Additional filter: automated / manual
- Additional filter: JQL (populate from dropdown)
- Can explore and specify a new test run
- Can execute a specific test run
- Can update manual steps
- Can get link to url with currently selected tabs

## Future Enhancements

### Web UI

Finding Test Results

2   - List all the existing results on server with pass/fail and summary count, clicking one loads it
    - Use a Drill + Visualization tool to view results over time as a chart
    - Deep Linking reflects current query and position within view

Exploring a Test Result

    - tag click links to view of just that tag
    - ability to expand and collapse the hierarchy
    - Visualize the individual test result as a chart using Drill + Visualization 
    - Ability to view/explore the full test configuration for a run
    - Ability to AND tags as well as OR them
    - Ability to GROUP ands and ors to arbitrary depth (wait until use case)

Loading / Saving of Single Test Result File 

    - Borrow from Tommy's Universe a simple import and export JSON mechanism that uses browser client only (no save)
    - Ability to save currently viewed test result to server side (file based)
    - Ability to POST a result from a running test job, such as Jenkins, so it will auto save (file based)
    - Enhance View / Save / Load to work with OJAI node bindings (while still supporting file mode)

Attachments

    - Ability to attach, automatically or during manual testing, supporting test data

Manual Testing

1   - Enable changing status of manual steps - should cause refresh of UI.
    - Enable specification of additional information or attachments
    - Ability to manually update (and then optionally save) step / scenario outcomes with pass/fail + outcome data
    - Ability to indicate in Gherkin / Test Steps that things are manual so as to cause display of them and udpate of them to work
    - Ability to filter by statuses that are pertinent only to manul steps

Visualizing Test Results over Time

    - Have a way to at least list all the results in the official data store repository (wherever that is)
    - Get the thing onto MapRDB, then use a web based drill client to visualize the data

Running a Test

    - Vary configuration from web UI
    - Indicate you want to run a new test and get taken to screen that explains how to manually do it
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
    
GitHub Integration

    - Pull test specification from particular github repo, branch, commit
    - Update github with test results

Google Sheets Integration

    - Establish way to map from Google Sheet to the Cucumber Case (just use tag nomenclature)
    - Link Google sheet test cases to most recent test result viewer (with preapplied filter
    - Link Google sheet to the most recent test result viewer (with no preapplied filters)
    - Show pass/fail in Google sheet via Test Portal REST API?
    
REST Interface

    - Allow other applications to easily call in and get results from current or previous test runs
    
### Framework
    
    - Enable injectable javascript code to be shared between client and server side
    - Use lazy compositions of filter predicates if it improves performance
    - Look into using TypeScript
    - Look into using webpack
    - Look into using lodash
    
## Bugs

    - Hard to reflect "empty" test / features / scenario
    - Extra status getting added by rendering select box prior to data arriving with console.log error
    
## CI/CD
    
Testing

    - As the system gets more complex, it itself neds tests. 
    
Pipeline

    - This system can go through the pipeline which it itself is a part of and can actually be 
      an internal team dogfooding of how well our pipeline is working based on how well this project goes
      through it.