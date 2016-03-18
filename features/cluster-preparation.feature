Feature: Cluster Preparation

  @SPYG-1 @prepareForInstallation
  Scenario: Prepare Cluster for Installation
    Given the Cluster Under Test is managed by ESXI
    And the Operating Systems of each node match what is configured
    When I revert the cluster to its configured "readyForInstallation" state
    And I wait "30" seconds
    Then the cluster does not have MapR Installed