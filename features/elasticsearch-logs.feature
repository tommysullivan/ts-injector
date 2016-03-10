Feature: ElasticSearch Logs

  @SPYG-125 @HealthCheck
  Scenario: Warden Logs present in ES Query
    Given I have installed Spyglass
    When I query each ElasticSearch Server for logs for index "logstash-*"
    Then Each result has at least 1 log containing the word "warden"