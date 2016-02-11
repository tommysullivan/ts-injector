Feature: ElasticSearch Logs

  @SPYG-125
  Scenario: Warden Logs present in ES Query
    Given I have an ES server running at "http://10.10.1.103:9200"
    When I query for logs for index "logstash-*"
    Then I see at least a single log containing the word "warden"