Feature: List

  @regression
  Scenario: Unique Repositories
    Given I have a list of repositories where two or more have the same URL
    When I ask for the unique items
    Then it gives the unique repositories

  @regression
  Scenario: Unique Numbers
    Given I have a list of items where two or more are the same
    When I ask for the unique items
    Then it gives the unique numbers

  @regression
  Scenario: Group Futures
    Given I have a list of integers and an async map function
    When I call flatMapToFutureList
    Then I get a promise that behaves as expected
