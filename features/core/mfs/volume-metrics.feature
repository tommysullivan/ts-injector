Feature: MFS Volume Metrics

  @SPYG-386 @healthCheck @metrics
  Scenario: Verify Volume metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                   |
      | avg:mapr.volume.logical_used  |
      | avg:mapr.volume.snapshot_used |
      | avg:mapr.volume.total_used    |
      | avg:mapr.volume.used          |
      | avg:mapr.volume.quota         |
    Then I receive at least "1" values per metric covering that time period
    And I query the following tag names for "avg:mapr.volume.logical_used" metric:
      | tag name    | values                       |
      | volume_name | mapr.apps, mapr.cluster.root |
      | entity_name | root,mapr                    |
    Then I receive at least "1" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @SPYG-177 @metrics
  Scenario: Check for total logical size,total size and and used size per volume
    Given I have installed Spyglass
    And I get the clusterName
    And  A volume called "volume-{testRunGUID}"is created
    And The volume is mounted
    And I set the volume quota to "1000"
    And I run the following commands on any given node in the cluster:
    """
    hadoop mfs -setcompression off {volumeMountPoint}
    head -c 30000000 /dev/urandom | hadoop fs -put - {volumeMountPoint}/t1
    head -c 30000000 /dev/urandom | hadoop fs -put - {volumeMountPoint}/t2
    """
    And I create a snapshot for the volume
    And I run the following commands on any given node in the cluster:
    """
    hadoop fs -rm {volumeMountPoint}/t2
    """
    And I wait "180" seconds
    When I specify the query range start as "1m-ago"
    And I query for each volume using tag key "volume_name" and tag value as the name of the volume
    And I query for the following metrics using tags:
      | metric name                  |
      | sum:mapr.volume.logical_used |
    And I get the expected value using maprcli volume info command
    Then I receive at least "1" values per metric covering that time period
    And the "logicalUsed" value from maprcli matches the value from OpenTSDB
    And I query for the following metrics using tags:
      | metric name                |
      | sum:mapr.volume.total_used |
    Then I receive at least "1" values per metric covering that time period
    And the "totalUsed" value from maprcli matches the value from OpenTSDB
    And I query for the following metrics using tags:
      | metric name          |
      | sum:mapr.volume.used |
    Then I receive at least "1" values per metric covering that time period
    And the "usedSize" value from maprcli matches the value from OpenTSDB
    And I query for the following metrics using tags:
      | metric name           |
      | sum:mapr.volume.quota |
    Then I receive at least "1" values per metric covering that time period
    And the "quota" value from maprcli matches the value from OpenTSDB
    And I query for the following metrics using tags:
      | metric name                   |
      | sum:mapr.volume.snapshot_used |
    Then I receive at least "1" values per metric covering that time period
    And the "snapshotSize" value from maprcli matches the value from OpenTSDB