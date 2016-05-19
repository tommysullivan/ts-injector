@logs
Feature: Warden Logs

  @SPYG-125 @healthCheck
  Scenario: Warden Logs present in ES Query
    Given I have installed Spyglass
    When I query the ElasticSearch Server for logs for index "mapr_monitoring-*"
    Then The result has at least 1 log containing the word "warden"

  @SPYG-125 @Manual
  Scenario: View Warden Log in Kibana Discovery Tab
    Given I have installed Spyglass
    And I have determined the kibana server and port for that cluster
    When I navigate to kibana's discovery interface
    Then I see at least one log from warden