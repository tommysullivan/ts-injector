# Test Portal

This is temporarily living in Spyglass repository but after it is mature, used, and proven valuable, assuming
that occurs, it can be extracted into its own repo.

Spyglass Specifics

    - Rewrite the Installation / Configuration tab of the test plan into Gherkin and use Sheets Integration above.
    - Link google docs to the tests

## For Tomorrow's Standup, what would I like to have as my status update?

- Can navigate to a URL and see a list of test results with the current pass/fail and summary
- Can view a given result
- Additional filter: automated / manual
- Additional filter: JQL (populate from dropdown)
- Can explore and specify a new test run
- Can execute a specific test run
- Can update manual steps
- Can get link to url with currently selected tabs

## Features

### Web UI

Viewing and exploring a Single Test Run Result

    - filter by status (will AND with other filters) - checkboxes with each status.
    - filter by multiple tags (OR'ed together)
    - clicking a tag auto changes the tags textbox to show that tag only

Loading / Saving of Single Test Result File 

    - Borrow from Tommy's Universe a simple load and save mechanism that uses browser client
    - Use the OJAI node bindings to interact with MapRDB when in server mode (is there a testable "local server" mode for non maprdb dev envs?)
    - Consider saving the results into other JSON data store
    - Consider saving the results as local files in the web server directory

Manual Testing

    - Ability to indicate in Gherkin / Test Steps that things are manual so as to cause display of them and udpate of them to work
    - Ability to view manual tests only independently of tags
    - Ability to filter by statuses that are pertinent only to manul steps

Visualizing Test Results over Time

    - Have a way to at least list all the results in the official data store repository (wherever that is)
    - Get the thing onto MapRDB, then use a web based drill client to visualize the data

Running a Test

    - Somehow choose the gherkin source and step definitions for "the world"
    - View that as a "dry run" as a starting point
    - Use filtering, etc.
    - Vary configuration from web UI
    
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
    
## Bugs

    - Colors wrong for pending / skipped status
    - Final empty feature not showing up
    - Hard to reflect "empty" test / features / scenario

## CI/CD
    
Testing

    - As the system gets more complex, it itself neds tests. 
    
Pipeline

    - This system can go through the pipeline which it itself is a part of and can actually be 
      an internal team dogfooding of how well our pipeline is working based on how well this project goes
      through it.