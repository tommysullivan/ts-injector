Feature: Hardware Maintenance
  As a Spyglass Contributor
  In order to manage and debug known, reproducible environments for dev and testing purposes
  I can create, destroy, and inspect ESXI-based cluster snapshots

  @prepareInstallationReadySnapshot
  Scenario: Create "installationReady" snapshot
    Given the Cluster Under Test is managed by ESXI
    And I revert the cluster to its configured "baseImage" state
    And I wait "30" seconds
    And I have updated the package manager
    And I use the package manager to install the "curl" package
    And I have installed Java
    And I wait "10" seconds
    And I power off each node in the cluster
    And I wait "10" seconds
    When I take "readyForInstallation" snapshots of each node in the cluster
    Then I retrieve the snapshot ids and output them to the stdout
    And I manually update the configured "readyForInstallation" state for the cluster with the snapshot ids