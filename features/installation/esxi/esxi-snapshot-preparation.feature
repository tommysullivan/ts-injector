Feature: Hardware Maintenance
  As a Spyglass Contributor
  In order to manage and debug known, reproducible environments for dev and testing purposes
  I can create, destroy, and inspect ESXI-based cluster snapshots

  Background:
    Given the Cluster Under Test is managed by ESXI
    And the Operating Systems of each node match what is configured

  @prepareInstallationReadySnapshotForCentOS7.1
  Scenario: Create Ready for Installation State from Base CentOS VM Image
    Given I revert the cluster to its configured "baseImage" state
    And I wait "30" seconds
    And I perform the following ssh commands on each node in the cluster:
    """
        echo `hostname -I`    `hostname` >> /etc/hosts
        echo 'nameserver 10.10.1.10' > /etc/resolv.conf
        echo 'nameserver 10.250.1.3' >> /etc/resolv.conf
        echo 'nameserver 10.10.100.241' >> /etc/resolv.conf
        echo 'PEERDNS=no' > /etc/sysconfig/network
    """
    And I have updated the package manager
    And I use the package manager to install the "curl" package
    And I have installed Java
    And I wait "10" seconds
    And I power off each node in the cluster
    And I wait "10" seconds
    When I take "javaInstalled" snapshots of each node in the cluster
    Then I retrieve the snapshot ids and output them to the stdout
    And I manually update the configured "readyForInstallation" state for the cluster with the snapshot ids

  @prepareInstallationReadySnapshot
  Scenario: Create "installationReady" snapshot for CentOS 6.5
    Given I revert the cluster to its configured "baseImage" state
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