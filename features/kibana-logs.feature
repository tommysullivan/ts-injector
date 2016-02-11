Feature: Kibana Logs

  @SPYG-125 @Manual
  Scenario: View Warden Log in Discovery Tab
    Given I have a kibana instance running at "http://10.10.1.103:5601"
    When I navigate to kibana's discovery interface
    Then I see at least one log from warden