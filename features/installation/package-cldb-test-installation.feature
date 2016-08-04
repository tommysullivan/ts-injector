Feature: Package Manager Installation

  @cldbSetup1
  Scenario: Installation via Package Manager and Configure.sh
    Given the cluster does not have MapR Installed
    And I prepare each node in the cluster with the correct repo configuration
    And I perform the following ssh commands on each node in the cluster:
    """
    id -u mapr || groupadd -g 500 mapr
    id -u mapr || useradd -u 500 -g mapr mapr

    """
    And I have updated the package manager
    And I have installed Java
    And I install the Core components
    And I prepare each node with the patch repo configuration
    And I have updated the package manager
    And I install the latest patch
    And I prepare the disk.list file
    And I run configure.sh on all nodes with only -C and -Z without -F
    And I wait "45" seconds
    And I perform the following ssh commands on each node in the cluster:
    """
    /opt/mapr/server/disksetup -F /root/disk.list
    """
    And I wait "45" seconds
    And I start zookeeper on all the nodes
    And I perform the following ssh commands on each node in the cluster:
    """
    service mapr-warden start
    """
    And I wait "90" seconds
    And I restart the warden
    Then the cluster has MapR Installed

  @cldbSetup2
  Scenario: Installation via Package Manager and Configure.sh
    Given the cluster does not have MapR Installed
    And I prepare each node in the cluster with the correct repo configuration
    And I perform the following ssh commands on each node in the cluster:
    """
    id -u mapr || groupadd -g 500 mapr
    id -u mapr || useradd -u 500 -g mapr mapr

    """
    And I have updated the package manager
    And I have installed Java
    And I install the Core components
    And I prepare the disk.list file
    And I run configure.sh on all nodes without -F
    And I wait "45" seconds
    And I perform the following ssh commands on each node in the cluster:
    """
    /opt/mapr/server/disksetup -W 1 -F /root/disk.list
    """
    And I wait "45" seconds
    And I start zookeeper on all the nodes
    And I perform the following ssh commands on each node in the cluster:
    """
    service mapr-warden start
    """
    And I wait "90" seconds
    And I install the license on cluster
    And I install all spyglass components
    And I run configure.sh for spyglass components
    And I wait "60" seconds
    And I restart the warden
    Then the cluster has MapR Installed