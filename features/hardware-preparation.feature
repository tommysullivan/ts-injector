Feature: Hardware Preparation

  @ESXI
  Scenario: ESXi Hardware Preparation
    Given the Cluster Under Test is managed by ESXI
    When I revert the cluster to its configured "readyForInstallation" state
    And I wait "30" seconds
    Then the cluster does not have MapR Installed