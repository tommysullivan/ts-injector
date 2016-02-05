Feature: Grafana Metrics

  @SPYG-124 @Manual
  Scenario: View First Metrics in Node Dashboard
    Given I have a grafana server and port set to "http://10.10.1.102:3000"
    And it has been populated with reports as described in "installation.feature/Grafana Dashboard Definition Import"
    And my grafana username is "admin"
    And my grafana password is "admin"
    And I have logged into Grafana
    When I navigate to the node dashboard
    When I look for the following metrics
      | metric name                  |
      | sum:rate:mapr.io.write_bytes |
      | sum:rate:mapr.io.read_bytes |
    Then I see the corresponding graph with reasonably accurate data for the past 24 hours