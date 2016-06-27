Feature: Cluster Version Graph Capture
  As a Spyglass Contributor
  In order to manage and debug known, reproducible environments for dev and testing purposes
  I capture the versions of all components that constitute the Cluster Under Test

  Scenario: Obtain the Version Graph
    When I request the cluster version graph
    Then it returns a valid JSON file