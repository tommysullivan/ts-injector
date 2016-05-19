@metrics
Feature: MapR DB Metrics

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