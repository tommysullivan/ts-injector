Feature: ElasticSearch Logs

  @SPYG-125 @healthCheck
  Scenario: Warden Logs present in ES Query
    Given I have installed Spyglass
    When I query the ElasticSearch Server for logs for index "mapr_monitoring-*"
    Then The result has at least 1 log containing the word "warden"