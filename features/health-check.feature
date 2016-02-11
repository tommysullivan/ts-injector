Feature: Health Check

  Background:
    Given my MCS username is "mapr"
    And my MCS password is "mapr"
    And my MCS is running at "https://10.10.1.103:8443"
    And I have an authenticated MCS Rest Client Session

  @HealthCheck @SPYG-123 @SPYG-143
  Scenario: Spyglass Operational Health Check
    Given I am testing against a configured cluster that is expected to be functioning
    When I use the MCS Rest Client Session to retrieve dashboardInfo
    And I ask the dashboardInfo for unhealthySpyglassServices
    Then I do not see any unhealthy spyglass services

  @SPYG-123 @SPYG-143
  Scenario Outline: Spyglass Health Check Negative Testing
    Given I want to make sure the health check is accurate
    When I purposely take down <service> on one or more nodes
    And I ask the dashboardInfo for unhealthySpyglassServices
    Then I see that <service> is in the list within "16" seconds
    Examples:
      | service |
      | collectd |
      | fluentd  |
      | elasticsearch |
      | opentsdb |
      | kibana |
      | grafana |