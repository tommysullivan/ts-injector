Feature: MCS

  Background:
    Given my MCS username is "mapr"
    And my MCS password is "mapr"
    And my MCS is running at "https://10.10.1.103:8443"
    And I have an authenticated MCS Rest Client Session

  @HealthCheck @SPYG-123 @SPYG-143
  Scenario: Spyglass Services appear Healthy in MCS after Installation
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

  @HealthCheck @SPYG-126
  Scenario Outline: MCS 3rd Party UI Links
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