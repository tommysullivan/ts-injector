@metrics
Feature: CPU Metrics

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