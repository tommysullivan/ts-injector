# Test Portal

This is temporarily living in Spyglass repository but after it is mature, used, and proven valuable, assuming
that occurs, it can be extracted into its own repo.

Spyglass Specifics

    - Rewrite the Installation / Configuration tab of the test plan into Gherkin and use Sheets Integration above.
    - Link google docs to the tests

## For Thursday's Standup, what would I like to have as my status update?

- Ability to specify test parameters (via CLI, web UI)
    - Includes Component under test versions
    - Includes details of the Cluster Under Test (pre-existing or created during tests)
    
- Ability to manually test based on Gherkin test plan
    - Ability to add comments to manual steps, including error messages
    - Ability to save the test
    - Instructions on how to begin a new test
    - Ability to upload a test result via POST

- JIRA Integration
    - Ability to use JQL to view associated tests
    - Ability to trigger update to JIRA with on screen test results

- Data Store
    - Store JSON in MapRDB
    
## Future Enhancements

### Web UI

Finding Test Results

    - Ability to filter by date range
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
    - REST discoverability / self-documentation
    - Get the thing onto MapRDB, then use a web based drill client to visualize the data
    
## Bugs

    - upon change of manual step status, view jumps around upon re-render if not close to top of page.
    - json and UI to look at a particular resource have different URLs
    - Hard to reflect "empty" test / features / scenario
    - TypeError: Cannot read property 'displayValue' of undefined - goes away with ng-if, but too slow so accepted bug
    
## CI/CD
    
Testing

    - As the system gets more complex, it itself neds tests. 
    
Pipeline

    - This system can go through the pipeline which it itself is a part of and can actually be 
      an internal team dogfooding of how well our pipeline is working based on how well this project goes
      through it.