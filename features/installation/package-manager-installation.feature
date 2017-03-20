Feature: Package Manager Installation

  @packageInstallation
  Scenario: Installation via Package Manager and Configure.sh
    Given the cluster does not have MapR Installed
    And I perform the following ssh commands on each node in the cluster:
    """
    id -u mapr || groupadd -g 5000 mapr
    id -u mapr || useradd -u 5000 -g mapr mapr
    """
    And I have updated the package manager
    And I have installed Java
    When I install packages with the "core" tag
    And I install packages with the "patch" tag
    And I install packages with the "ecosystem" tag
    And I prepare the disk.list file
    And I run configure.sh on all nodes
    And I wait for cldb service to come up
    And I install the license on cluster
    And I install packages with the "spyglass" tag
    And I run configure.sh for spyglass components
    And I wait "30" seconds
    And I "restart" all "mapr-warden" services
    And I wait for cldb service to come up
    Then all health checkable services are healthy