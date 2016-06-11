Feature: Secure Package Manager Installation

  @SPYG-583
  Scenario: Installation via Package Manager and Configure.sh
    Given the cluster does not have MapR Installed
    And I create the user "mapr" with id "5000" group "mapr" and password "mapr"
    And I have updated the package manager
    And I have installed Java
    And I install packages with the "core" tag
    And I install packages with the "ecosystem" tag
    And I prepare the disk.list file
    And I run configure.sh with genkeys and nostart option on first cldb node
    And I copy cldb key file to all other cldb nodes and zookeeper nodes
    And I copy maprserverticket, ssl_keystore, ssl_truststore to all nodes
    And I run configure.sh with secure option on all nodes except first cldb node
    And I start all "mapr-zookeeper" services
    And I start all "mapr-warden" services
    And I wait "45" seconds
    And I install the license on cluster
    And I perform the following ssh commands on each node in the cluster:
    """
    echo 'mapr' | maprlogin password
    """
    And I perform the following ssh commands on each node in the cluster as user "mapr" with password "mapr":
    """
    echo 'mapr' | maprlogin password
    """
    And I install packages with the "spyglass" tag
    And I run configure.sh for spyglass components
    And I restart all "mapr-warden" services
    And I wait "90" seconds
    Then all health checkable services are healthy