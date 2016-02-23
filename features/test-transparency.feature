Feature: Test Transparency
  As a Spyglass Stakeholder
  In order to ensure a high quality release
  I desire to easily view current and past test statuses and connect that information to
  JIRA, Github, and Google Sheets

  @Manual @SPYG-217
  Scenario: Results can be Synced to JIRA
    Given I am viewing a test result in test portal
    When I click "sync to JIRA"
    Then it updates tagged JIRA issues with test result statuses