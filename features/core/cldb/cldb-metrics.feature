Feature: CLDB Metrics

  @SPYG-386 @metrics @healthCheck
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