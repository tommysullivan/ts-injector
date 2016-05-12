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

  Scenario: Verify cpu metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name        |
      |avg:cpu.percent    |
    Then I receive at least "1" values per metric covering that time period
    And I query the following tag names for "avg:cpu.percent" metric:
      |tag name       |values                   |
      |cpu_core       |0,1,2                    |
      |cpu_class      |idle, user, nice, system |
    Then I receive at least "1" values per metric covering that time period
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

  @SPYG-386
  Scenario: Verify cldb metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name                            |
      |avg:mapr.cldb.cluster_cpu_total        |
      |avg:mapr.cldb.cluster_cpubusy_percent  |
      |avg:mapr.cldb.cluster_disk_capacity    |
      |avg:mapr.cldb.cluster_diskspace_used   |
      |avg:mapr.cldb.cluster_memory_capacity  |
      |avg:mapr.cldb.cluster_memory_used      |
      |avg:mapr.cldb.containers               |
      |avg:mapr.cldb.containers_created       |
      |avg:mapr.cldb.containers_unusable      |
      |avg:mapr.cldb.disk_space_available     |
      |avg:mapr.cldb.nodes_in_cluster         |
      |avg:mapr.cldb.nodes_offline            |
      |avg:mapr.cldb.rpc_received             |
      |avg:mapr.cldb.rpcs_failed              |
      |avg:mapr.cldb.storage_pools_cluster    |
      |avg:mapr.cldb.storage_pools_offline    |
      |avg:mapr.cldb.volumes                  |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence


  @SPYG-386
  Scenario: Verify maprDB metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name                    |
      |avg:mapr.db.append_rpcs        |
      |avg:mapr.db.get_currpcs        |
      |avg:mapr.db.get_rpcrows        |
      |avg:mapr.db.get_rpcs           |
      |avg:mapr.db.put_currpcs        |
      |avg:mapr.db.put_rpcrows        |
      |avg:mapr.db.put_rpcs           |
      |avg:mapr.db.scan_currpcs       |
      |avg:mapr.db.scan_rpcrows       |
      |avg:mapr.db.scan_rpcs          |
      |avg:mapr.db.updateandget_rpcs  |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @SPYG-386
  Scenario: Verify maprIO metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name                |
      |avg:df.df_complex          |
      |avg:mapr.io.read_bytes     |
      |avg:mapr.io.reads          |
      |avg:mapr.io.write_bytes    |
      |avg:mapr.io.writes         |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence
