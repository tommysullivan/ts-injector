Feature: MCS Links to Spyglass UI

  @healthCheck @SPYG-126
  Scenario: MCS 3rd Party UI Links
    Given I have installed Spyglass
    And I have an authenticated MCS Rest Client Session
    When I ask for a link to the following applications:
      | application |
      | grafana     |
      | kibana      |
    And a GET request of each URL does not return an error status code