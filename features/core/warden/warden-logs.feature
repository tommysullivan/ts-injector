Feature: Warden Logs

  @SPYG-125 @logs @healthCheck
  Scenario: Warden Logs present in ES Query
    Given I have installed Spyglass
    When I query for logs for service "warden"
    Then I receive a result containing greater than "10" entries

  @SPYG-125 @Manual @logs
  Scenario: View Warden Log in Kibana Discovery Tab
    Given I have installed Spyglass
    And I have determined the kibana server and port for that cluster
    When I navigate to kibana's discovery interface
    Then I see at least one log from warden