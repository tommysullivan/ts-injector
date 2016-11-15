Feature: List Cluster Ids

  @regression
  Scenario: List Cluster Ids from CLI
    When I run "bin/devops cluster ids" from the command line
    Then the output returns a non-empty array of cluster ids