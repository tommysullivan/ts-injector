Feature: Hardware Preparation

  @SPYG-1 @ESXI
  Scenario: ESXi Hardware Preparation
    Given the Cluster Under Test is managed by ESXI
    And the Operating Systems of each node match what is configured to be expected
    When I revert the cluster to its configured "readyForInstallation" state
    And I wait "30" seconds
    Then the cluster does not have MapR Installed