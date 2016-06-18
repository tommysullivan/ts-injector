Feature: This should fail which verifies the metrics is working correctly

  @metricsCheck
  Scenario: Verify swap memory metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name      |
      | avg:swap.swap    |
      | avg:swap.swap_io |
    Then I receive at least "1" values per metric covering that time period
    And I query the following tag names for "avg:swap.swap" metric:
      | tag name  | values               |
      | swap_type | free, used, buffered |
    Then I receive at least "10" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence