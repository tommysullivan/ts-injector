Feature: Package Manager Installation

  @SPYG-497
  Scenario: Installation via Package Manager and Configure.sh
    Given the cluster does not have MapR Installed
    And I prepare each node in the cluster with the correct repo configuration
    And I perform the following ssh commands on each node in the cluster:
    """
    id -u mapr || groupadd -g 5000 mapr
    id -u mapr || useradd -u 5000 -g mapr mapr
    """
    And I have updated the package manager
    And I have installed Java
    And I install the Core components
#    And I prepare each node with the patch repo configuration
#    And I have updated the package manager
#    And I install the latest patch
    And I prepare the disk.list file
    And I run configure.sh on all nodes
    And I wait "45" seconds
    And I install the license on cluster
#    And I remove the opensource repo
#    And I prepare each node with the spyglass repo configuration
#    And I have updated the package manager
    And I install all spyglass components
    And I run configure.sh for spyglass components
    And I wait "60" seconds
    And I restart the warden
    And I wait "120" seconds
    Then all health checkable services are healthy
