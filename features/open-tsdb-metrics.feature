Feature: OpenTSDB Metrics REST API

  @SPYG-124 @healthCheck
  Scenario: Getting Simple Node Metrics via REST API
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                                   |
      | sum:rate:mapr.io.write_bytes                  |
      | sum:rate:mapr.io.read_bytes                   |
      | sum:rate:interface.if_octets.rx               |
      | sum:rate:disk.disk_io_time.io_time            |
      | sum:rate:disk.disk_io_time.weighted_io_time   |
      | sum:rate:disk.disk_merged.read                |
      | sum:rate:disk.disk_merged.write               |
      | sum:rate:disk.disk_octets.read                |
      | sum:rate:disk.disk_octets.write               |
      | sum:rate:disk.disk_ops.read                   |
      | sum:rate:disk.disk_ops.write                  |
      | sum:rate:disk.disk_time.read                  |
      | sum:rate:disk.disk_time.write                 |
      | sum:rate:disk.pending_operations              |
      | sum:rate:interface.if_errors.rx               |
      | sum:rate:interface.if_errors.tx               |
      | sum:rate:interface.if_octets.rx               |
      | sum:rate:interface.if_octets.tx               |
      | sum:rate:interface.if_packets.rx              |
      | sum:rate:interface.if_packets.tx              |
      | sum:rate:load.load.longterm                   |
      | sum:rate:load.load.midterm                    |
      | sum:rate:load.load.shortterm                  |
    Then I receive at least "200" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence