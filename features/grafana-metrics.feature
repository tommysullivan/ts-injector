Feature: Grafana Metrics

  @SPYG-124 @Manual
  Scenario: View First Metrics in Node Dashboard
    Given I have installed Spyglass
    And I have determined the grafana server and port for that cluster
    And it has been populated with reports as described in "installation.feature/Grafana Dashboard Definition Import"
    And my grafana username is "admin"
    And my grafana password is "admin"
    And I have logged into Grafana
    When I navigate to the node dashboard
    And I look for the following metrics
      | metric name                  |
      | sum:rate:mapr.io.write_bytes |
      | sum:rate:mapr.io.read_bytes |
    Then I see the corresponding graph with reasonably accurate data for the past 24 hours

  @SPYG-124
  Scenario: Grafana Dashboard Definition Import
    Given I have installed Spyglass
    And I have determined the grafana server and port for that cluster
    And my grafana username is "admin"
    And my grafana password is "admin"
    And I have an authenticated grafana rest client
    When I request to import the following dashboard definitions:
      | dashboard name |
      | cldb           |
      | dbmetrics      |
      | node           |
      | volume         |
      | yarn           |
    Then the reports are all available to view