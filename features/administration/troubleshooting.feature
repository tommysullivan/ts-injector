Feature: Troubleshooting
  As an administrator
  In order to investigate and possibly solve a problem I am having
  I access the Troublshooting guide within Spyglass and follow it to helpful dashboards and hints of things to do

  Scenario: Searching for Troubleshooting Guide on a Topic
    Given I navigate to the Troubleshooting Page
    When I type in some words for the topic I am interested in
    Then I see links for matching troubleshooting guides

  Scenario: Troubleshooting Guide
    Given I am viewing a troubleshooting Guide
    When it suggests to look at a particular dashboard or set of dashboards
    Then I can click the suggested dashboard names and I am taken there
    And I do not totally lose my place in the troubleshooting guide
    And I can continue clicking next steps, including contacting support or linking to instructions on other admin actions

  Scenario: Errors contain links to information about them
    Given an error is logged
    Then it should be a well defined error type with details that enable retelling of the context
    And there should be a url that a user can click to understand more about the error