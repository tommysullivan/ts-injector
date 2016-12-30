Feature: Package Manager Uninstall

  @packageUninstall
  Scenario: Cluster Uninstall via Package Manager
    Given the cluster has MapR Installed
    And I remove all non-core components
    And I stop "mapr-warden" service on all nodes if they are running
    And I stop "mapr-zookeeper" service on all nodes if they are running
    And I remove all the core components
    And I remove all the core components
    And I clear all mapr data
    Then the cluster does not have MapR Installed
