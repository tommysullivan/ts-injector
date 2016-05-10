Feature: Hardware Maintenance
  As a Spyglass Contributor
  In order to manage and debug known, reproducible environments for dev and testing purposes
  I can create, destroy, and inspect ESXI-based cluster snapshots

  Background:
    Given the Cluster Under Test is managed by ESXI
    And the Operating Systems of each node match what is configured

  @revertClusterToBaseState
  Scenario: Revert cluster to base state
    Given I revert the cluster to its configured "baseImage" state

  @deleteInstallationReadySnapshots
  Scenario: Remove existing "readyForInstallation" snapshots
    When I delete "readyForInstallation" snapshots for each node in the cluster

  @getSnapshotInfoForCluster
  Scenario: Get snapshot info for cluster
    When I request the latest snapshot info from the cluster

  @captureCurrentStateAsSnapshot
  Scenario: Capture Current State as Snapshot
    When I take "readyForInstallation" snapshots of each node in the cluster

  @prepareCentOS7.1
  Scenario: Create Ready for Installation State from Base CentOS VM Image
    Given I revert the cluster to its configured "baseImage" state
    And I wait "30" seconds
    When I perform the following ssh commands on each node in the cluster:
    """
        echo `hostname -I`    `hostname` >> /etc/hosts
        echo 'nameserver 10.10.1.10' > /etc/resolv.conf
        echo 'nameserver 10.250.1.3' >> /etc/resolv.conf
        echo 'nameserver 10.10.100.241' >> /etc/resolv.conf
        echo 'PEERDNS=no' > /etc/sysconfig/network
    """
    And I wait "10" seconds
    And I have updated the package manager
    And I have installed Java
    Then I take "readyForInstallation" snapshots of each node in the cluster
    And I manually retrieve the ids of these new snapshots based on the console output of the previous step
    And I manually update the configured "readyForInstallation" state for the cluster with the snapshot ids

  @prepareCentOS6.5
  Scenario: Create "installationReady" snapshot for CentOS 6.5
    Given I revert the cluster to its configured "baseImage" state
    And I wait "30" seconds
    And I have updated the package manager
    When I have installed Java
    Then I take "readyForInstallation" snapshots of each node in the cluster
    And I manually retrieve the ids of these new snapshots based on the console output of the previous step
    And I manually update the configured "readyForInstallation" state for the cluster with the snapshot ids

  @prepareUbuntu
  Scenario: Create Ready for Installation State from Base CentOS VM Image
    Given I revert the cluster to its configured "baseImage" state
    And I wait "30" seconds
    And I have updated the package manager
    And I use the package manager to install the "curl" package
    And I have installed Java
    Then I take "readyForInstallation" snapshots of each node in the cluster
    And I retrieve the latest snapshot info for the cluster and output it to stdout
    And I manually update the configured "readyForInstallation" state for the cluster with the snapshot ids

  @createInstallationReadySnapshotsForSuse12
  Scenario: Create Ready for Installation State from Base SUSE 12 IMAGE
    Given I revert the cluster to its configured "baseImage" state
    And I wait "30" seconds
    And I have updated the package manager
    And I have installed Java
    And I take "readyForInstallation" snapshots of each node in the cluster
    And I retrieve the latest snapshot info for the cluster and output it to stdout
    Then I manually update the configured "readyForInstallation" state for the cluster with the snapshot ids