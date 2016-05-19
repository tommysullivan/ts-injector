@metrics
Feature: Network Metrics

  @SPYG-124 @healthCheck
  Scenario: Getting Simple Node Metrics via REST API
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                                   |
      | sum:rate:interface.if_octets.rx               |
      | sum:rate:interface.if_errors.rx               |
      | sum:rate:interface.if_errors.tx               |
      | sum:rate:interface.if_octets.rx               |
      | sum:rate:interface.if_octets.tx               |
      | sum:rate:interface.if_packets.rx              |
      | sum:rate:interface.if_packets.tx              |
    Then I receive at least "200" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @SPYG-386
  Scenario: Verify network metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name                       |
      |avg:interface.if_errors.rx        |
      |avg:interface.if_errors.tx        |
      |avg:interface.if_octets.rx        |
      |avg:interface.if_octets.tx        |
      |avg:interface.if_packets.rx       |
      |avg:interface.if_packets.tx       |
    Then I receive at least "1" values per metric covering that time period
    And I query the following tag names for "avg:interface.if_errors.rx" metric:
      |tag name         |values          |
      |interface_name   |*               |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence