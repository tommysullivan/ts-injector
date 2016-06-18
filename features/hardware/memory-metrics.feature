Feature: Memory Metrics

  @SPYG-466 @metrics @healthCheck
  Scenario: Verify memory metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name              |
      |avg:memory.memory        |
    Then I receive at least "10" values per metric covering that time period
    And I query the following tag names for "avg:memory.memory" metric:
      |tag name       |values               |
      |memory_type    |free, used, buffered |
    Then I receive at least "10" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @SPYG-466 @metrics @healthCheck
  Scenario: Verify swap memory metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name              |
      |avg:swap.swap            |
      |avg:swap.swap_io         |
    Then I receive at least "10" values per metric covering that time period
    And I query the following tag names for "avg:swap.swap" metric:
      |tag name         |values               |
    Then I receive at least "10" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence

  @SPYG-466 @metrics @healthCheck
  Scenario: Verify virtual memory metrics
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      |metric name                              |
      |avg:vmem.vmpage_faults.majflt            |
      |avg:vmem.vmpage_faults.minflt            |
      |avg:vmem.vmpage_io.memory.in             |
      |avg:vmem.vmpage_io.memory.out            |
    Then I receive at least "10" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence