Feature: Example Manual Test
  Exists to ensure that manual test results work in the portal during integration testing

  @regression @Manual
  Scenario:
    Given I have a manual scenario
    When I view it in the portal
    Then it works as described in the portal requirements and tests