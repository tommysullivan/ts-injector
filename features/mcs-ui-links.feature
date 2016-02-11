@SPYG-126
Feature: MCS UI Links

  Scenario Outline:
    Given my MCS username is "mapr"
    And my MCS password is "mapr"
    And my MCS is running at "https://10.10.1.103:8443"
    And I have an authenticated MCS Rest Client Session
    When I ask for a link to <application>
    Then I receive a URL to <application>
    And a GET request of the URL does not return an error status code
    Examples:
      | application |
      | grafana     |
      | kibana      |