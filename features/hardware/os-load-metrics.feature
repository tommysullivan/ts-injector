@metrics
Feature: OS Load Metrics

  Scenario: Load Metrics from OS
    Given I have installed Spyglass
    When I specify the query range start as "1h-ago"
    And I query for the following metrics:
      | metric name                                   |
      | sum:rate:load.load.longterm                   |
      | sum:rate:load.load.midterm                    |
      | sum:rate:load.load.shortterm                  |
    Then I receive at least "200" values per metric covering that time period
    And those values may be incorrect but we are only testing for presence