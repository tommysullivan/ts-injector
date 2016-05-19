@metrics
Feature: Disk Metrics

  @SPYG-124 @Manual
  Scenario: Disk Metrics show in Grafana Dashboard
    Given I have installed Spyglass
    And I have determined the grafana server and port for that cluster
    And it has been populated with reports as described in "installation.feature/Grafana Dashboard Definition Import"
    And my grafana username is "admin"
    And my grafana password is "admin"
    And I have logged into Grafana
    When I navigate to the node dashboard
    And I look for the following metrics
      | metric name                  |
      | sum:rate:mapr.io.write_bytes |
      | sum:rate:mapr.io.read_bytes |
    Then I see the corresponding graph with reasonably accurate data for the past 24 hours

  @SPYG-124 @healthCheck
  Scenario: Getting Simple Node Metrics via REST API
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                                   |
      | sum:rate:mapr.io.write_bytes                  |
      | sum:rate:mapr.io.read_bytes                   |
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
    Then I receive at least "50" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @SPYG-386
  Scenario: Verify diskFree metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name              |
      |avg:df.df_complex        |
      |avg:df.percent_bytes     |
    Then I receive at least "1" values per metric covering that time period
    And I query the following tag names for "avg:df.df_complex" metric:
      |tag name       |values               |
      |df_partition   |*                    |
      |df_type        |free, used, reserved |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @SPYG-386
  Scenario: Verify disk metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name                         |
      |avg:disk.disk_io_time.io_time       |
      |avg:disk.disk_merged.read           |
      |avg:disk.disk_merged.write          |
      |avg:disk.disk_octets.read           |
      |avg:disk.disk_octets.write          |
      |avg:disk.disk_ops.read              |
      |avg:disk.disk_ops.write             |
      |avg:disk.disk_time.read             |
      |avg:disk.disk_time.write            |
      |avg:disk.pending_operations         |
    Then I receive at least "1" values per metric covering that time period
    And I query the following tag names for "avg:disk.disk_io_time.io_time" metric:
      |tag name       |values              |
      |disk_name      |sda,sdb             |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence
