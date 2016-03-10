Feature: Kibana Logs

  @SPYG-125 @Manual
  Scenario: View Warden Log in Discovery Tab
    Given I have installed Spyglass
    And I have determined the kibana server and port for that cluster
    When I navigate to kibana's discovery interface
    Then I see at least one log from warden