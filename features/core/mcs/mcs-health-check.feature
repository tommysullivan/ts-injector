Feature: MCS Health Check

  @healthCheck @SPYG-123 @SPYG-143
  Scenario: Spyglass Services appear Healthy in MCS after Installation
    Given I have installed Spyglass
    And I have an authenticated MCS Rest Client Session
    When I use the MCS Rest Client Session to retrieve dashboardInfo
    And I ask the dashboardInfo for unhealthySpyglassServices
    Then I do not see any unhealthy spyglass services

  @Manual
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