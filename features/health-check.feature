Feature: Health Check

  Background:
    Given the cluster under test is a single node cluster
    And my MCS username is "${mcsUserName}"
    And my MCS password is "${mcsPassword}"
    And my MCS is running at "${mcsProtocolHostAndOptionalPort}"
    And I have an authenticated MCS Rest Client Session

  @HealthCheck @SPYG-123 @SPYG-143
  Scenario: Spyglass Operational Health Check
    Given I am testing against a configured cluster that is expected to be functioning
    When I use the MCS Rest Client Session to retrieve dashboardInfo
    And I ask the dashboardInfo for unhealthySpyglassServices
    Then I do not see any unhealthy spyglass services

  @SPYG-123 @SPYG-143 @WIP
  Scenario Outline: Spyglass Health Check Negative Testing
    Given I want to make sure the health check is accurate
    When I purposely take down <service>
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