Feature: OpenTSDB Metrics REST API

  @SPYG-124 @HealthCheck
  Scenario: Getting Simple Node Metrics via REST API
    Given the URL and port of OpenTSDB is "http://10.10.1.103:4242"
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                  |
      | sum:rate:mapr.io.write_bytes |
      | sum:rate:mapr.io.read_bytes |
      | sum:rate:interface.if_octets.rx      |
    Then I receive at least "200" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence