Feature: Yarn Metrics

  @metrics @healthCheck
  Scenario: Verify presence of RM per queue via JMX metrics
    Given I have installed Spyglass
    And I "restart" all service named "resourcemanager" using maprcli
    And I "restart" all service named "collectd" using maprcli
    And I wait "40" seconds
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                                |
      | avg:mapr.rm.active_applications            |
      | avg:mapr.rm.active_users                   |
      | avg:mapr.rm.aggregate_containers_allocated |
      | avg:mapr.rm.aggregate_containers_released  |
      | avg:mapr.rm.allocated_MB                   |
      | avg:mapr.rm.allocated_vcores               |
      | avg:mapr.rm.apps_completed                 |
      | avg:mapr.rm.apps_failed                    |
      | avg:mapr.rm.apps_pending                   |
      | avg:mapr.rm.apps_running                   |
      | avg:mapr.rm.apps_submitted                 |
      | avg:mapr.rm.available_MB                   |
      | avg:mapr.rm.available_disks                |
      | avg:mapr.rm.available_vcores               |
      | avg:mapr.rm.pending_MB                     |
      | avg:mapr.rm.pending_containers             |
      | avg:mapr.rm.pending_disks                  |
      | avg:mapr.rm.pending_vcores                 |
      | avg:mapr.rm.reserved_MB                    |
      | avg:mapr.rm.reserved_containers            |
      | avg:mapr.rm.reserved_disks                 |
      | avg:mapr.rm.reserved_vcores                |
    Then I receive at least "1" values per metric covering that time period
    And I query the following tag names for "avg:mapr.rm.active_applications" metric:
      | tag name | values           |
      | rm_queue | default-queue    |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @metrics @healthCheck
  Scenario: Verify presence of RM per queue via REST metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                                      |
      | avg:mapr.rm_queue.apps_pending                   |
      | avg:mapr.rm_queue.apps_running                   |
      | avg:mapr.rm_queue.fairshare_disks                |
      | avg:mapr.rm_queue.fairshare_memory               |
      | avg:mapr.rm_queue.fairshare_vcores               |
      | avg:mapr.rm_queue.used_disks                     |
      | avg:mapr.rm_queue.used_memory                    |
      | avg:mapr.rm_queue.used_vcores                    |
      | avg:mapr.rm_queue.max_disks                      |
      | avg:mapr.rm_queue.max_memory                     |
      | avg:mapr.rm_queue.max_vcores                     |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @metrics @healthCheck
  Scenario: Verify presence of RM per cluster via REST metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                         |
      | avg:mapr.rm_cluster.active_nodes    |
      | avg:mapr.rm_cluster.total_nodes     |
      | avg:mapr.rm_cluster.unhealthy_nodes |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @metrics @healthCheck
  Scenario: Verify presence of NodeManager metrics
    Given I have installed Spyglass
    And I "restart" all service named "nodemanager" using maprcli
    And I "restart" all service named "collectd" using maprcli
    And I wait "40" seconds
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                      |
      | avg:mapr.nm.allocated_GB         |
      | avg:mapr.nm.allocated_containers |
      | avg:mapr.nm.allocated_vcores     |
      | avg:mapr.nm.available_vcores     |
      | avg:mapr.nm.available_GB         |
      | avg:mapr.nm.containers_completed |
      | avg:mapr.nm.containers_failed    |
      | avg:mapr.nm.containers_initing   |
      | avg:mapr.nm.containers_killed    |
      | avg:mapr.nm.containers_running   |
      | avg:mapr.nm.containers_launched  |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence




