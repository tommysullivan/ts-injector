Feature: ErrorWithCause

  @regression
  Scenario: Upload
    When I construct an ErrorWithCause and a causal Exception then I can print the correct message and toString