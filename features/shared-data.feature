Feature: Shared Data

  @regression
  Scenario: Sharing data between steps in different step files
    Given I have defined some shared data and set it in a before hook
    Then I can access the shared data from a step in file 1
    And I can access the shared data from a step in file 2