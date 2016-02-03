Feature: Health Check

  @SPYG-143 @SPYG-123 @WIP
  Scenario: Post-Install Health Check
    Given my MCS username is "mapr"
    And my MCS password is "mapr"
    And my MCS is running at "https://10.10.88.118:8443"
    And I have an authenticated MCS Rest Client Session
    And I use the session to retrieve dashboardInfo
    When I ask the dashboardInfo for unhealthySpyglassServices
    Then I do not see any unhealthy spyglass services