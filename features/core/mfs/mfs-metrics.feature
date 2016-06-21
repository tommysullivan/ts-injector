Feature: MFS Metrics

  @SPYG-386 @healthCheck @metrics
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

  @SPYG-386 @healthCheck @metrics
  Scenario: Verify RPC metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name             |
      | avg:mapr.rpc.bytes_recd |
      | avg:mapr.rpc.bytes_sent |
      | avg:mapr.rpc.calls_recd |
    Then I receive at least "10" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence