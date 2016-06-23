@metrics @healthCheck @SPYG-475
Feature: HBase Metrics

  Scenario: Check for the presence of HBaseMaster metrics
    Given I have a node running the "mapr-hbase-master" service
    When I specify the query range start as "1m-ago"
    And I "restart" all service named "hbmaster" using maprcli
    And I "restart" all service named "collectd" using maprcli
    And I wait "40" seconds
    And I query for the following metrics:
      | metric name                                                |
      | sum:mapr.hbase_master.region_servers                       |
      | sum:mapr.hbase_master.dead_region_servers                  |
      | sum:mapr.hbase_master.regions_in_transition                |
      | sum:mapr.hbase_master.regions_in_transition_over_threshold |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  Scenario: Check for the presence of HBaseRegionServer metrics
    Given I have a node running the "mapr-hbase-regionserver" service
    When I specify the query range start as "1m-ago"
    And I restart all service named "hbregionserver" using maprcli
    And I restart all service named "collectd" using maprcli
    And I wait "40" seconds
    And I query for the following metrics:
      | metric name                                                   |
      | sum:mapr.hbase_region_server.region_count                     |
      | sum:mapr.hbase_region_server.store_file_count                 |
      | sum:mapr.hbase_region_server.store_file_size                  |
      | sum:mapr.hbase_region_server.hlog_file_count                  |
      | sum:mapr.hbase_region_server.total_requests                   |
      | sum:mapr.hbase_region_server.read_requests                    |
      | sum:mapr.hbase_region_server.write_requests                   |
      | sum:mapr.hbase_region_server.open_connections                 |
      | sum:mapr.hbase_region_server.active_rpc_handlers              |
      | sum:mapr.hbase_region_server.calls_general_queue              |
      | sum:mapr.hbase_region_server.calls_replication_queue          |
      | sum:mapr.hbase_region_server.calls_priority_queue             |
      | sum:mapr.hbase_region_server.flush_queue_length               |
      | sum:mapr.hbase_region_server.updates_blocked_time             |
      | sum:mapr.hbase_region_server.compaction_queue_length          |
      | sum:mapr.hbase_region_server.block_cache_hits                 |
      | sum:mapr.hbase_region_server.block_cache_misses               |
      | sum:mapr.hbase_region_server.block_cache_express_hits_percent |
      | sum:mapr.hbase_region_server.local_files_percent              |
      | sum:mapr.hbase_region_server.block_cache_express_hits_percent |
      | sum:mapr.hbase_region_server.appends                          |
      | sum:mapr.hbase_region_server.deletes                          |
      | sum:mapr.hbase_region_server.flush_time                       |
      | sum:mapr.hbase_region_server.gets                             |
      | sum:mapr.hbase_region_server.increments                       |
      | sum:mapr.hbase_region_server.mutates                          |
      | sum:mapr.hbase_region_server.replays                          |
      | sum:mapr.hbase_region_server.scan_nexts                       |
      | sum:mapr.hbase_region_server.split_time                       |
      | sum:mapr.hbase_region_server.slow_appends                     |
      | sum:mapr.hbase_region_server.slow_deletes                     |
      | sum:mapr.hbase_region_server.slow_gets                        |
      | sum:mapr.hbase_region_server.slow_increments                  |
      | sum:mapr.hbase_region_server.slow_puts                        |
      | sum:mapr.hbase_region_server.authentication_successes         |
      | sum:mapr.hbase_region_server.authenticaiton_failures          |
      | sum:mapr.hbase_region_server.writes_without_wal               |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence  
