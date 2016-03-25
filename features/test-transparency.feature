Feature: Test Transparency
  As a Spyglass Stakeholder
  In order to ensure a high quality release
  I desire to easily view current and past test statuses and connect that information to
  JIRA, Github, and Google Sheets

  @Manual @SPYG-217
  Scenario: View and Edit Manual Gherkin Tests alongside Automated Tests
    Given I have marked a Scenario with the @Manual tag
    And I have run bin/run-end-to-end-tests against some @Manual and some automated tests
    And the CI Server is running
    When I view the result in the CI Server
    Then I can see the automated test results in a hierarchical view
    And the manual steps are editable and in a "not executed" state

  @Manual @SPYG-217
  Scenario: Saving Updates to Manual Tests
    Given I have changed manual test results
    When I click "save"
    Then I am notified that the save has succeeded
    And if I navigate to the Test Result Explorer
    And click back into the previously saved test result
    Then I see it has retained my changes

  @Manual @SPYG-217
  Scenario: Filter by Tag
    Given I am viewing a Test Result or the Test Result Explorer
    When I type in "@tag1 @tag2 ~@tag3"
    Then the view updates to only show features / scenarios tagged with either @tag1 or @tag2
    And I also see items that do not have @tag3
    And all the charts and summaries and statuses update to reflect the filtered view of the test

  @Manual @SPYG-217
  Scenario: Manual vs. Automated
    Given I am viewing a Test Result or the Test Result Explorer
    When I change the filter to "Manual Only"
    Then I only see the manual tests
    When I change the filter to "Automated Only"
    Then I only see the automated tests
    When I change the filter to "Automated and Manual"
    Then I can see both automated and manual tests

  @Manual @SPYG-217
  Scenario: Find Cases with Missing JIRAs
    Given I have some tests that are not associated with a JIRA ticket
    When I check "show cases with mising JIRA only"
    Then I only see those features / scenarios that have no JIRA ticket

  @Manual @SPYG-217
  Scenario: Filter by Status
    Given I have tests with various statuses
    When I check and uncheck the statuses in the upper right
    Then the view and charts update to reflect only the subset of features / scenarios with the matching statuses

  @Manual @SPYG-217
  Scenario: JQL Query
    Given I have tested a JQL Query using JIRA and know it to work
    When I paste that JQL query into the JQL text input
    Then the view filters to show only those tickets which are associated with the JIRA tickets in the JQL result

  @Manual @SPYG-217
  Scenario: Missing Sought Tag Notification
    When I search for tags directly by typing them or indirectly via JQL that have no test cases
    Then I see a warning indicating how many tags were found / not found / sought
    And I see the names of the tags that were not found

  @Manual @SPYG-217
  Scenario: Tag Name links to JIRA ticket
    Given I have some scenarios with a @SPYG-XXX tag
    When I click said tag name where it appears
    Then I am taken to the JIRA ticket page for that tag

  @Manual @SPYG-217
  Scenario: Sync with JIRA
    Given I have an up to date test result with some scenarios with @SPYG-XXX JIRA tags
    When I click "sync results to JIRA"
    Then I am notified that the results have been synced
    And when I view the JIRA ticket(s) that should have been updated
    Then I see comments in each ticket summing up the status of that ticket's test
    And I see summaries of scenarios, features and steps passed / failed / pending / not exected
    And I see a link that takes me to the CI Portal displaying just that story's results using pre-filtered query

  @Manual @SPYG-217
  Scenario: Publish Test Result to CI Server using REST API
    Given I want to publish a test result from my local computer to the CI server
    When I do an HTTP PUT to ci-server-host/test-results/my-test-result-name-here
    Then I receive a 200 OK
    And I see the test result in the Test Result Explorer
    And I can open and view the test

  @Manual @SPYG-217
  Scenario: Results can be Synced to JIRA
    Given I am viewing a test result in test portal
    When I click "sync to JIRA"
    Then it updates tagged JIRA issues with test result statuses