Feature: Package Manager Uninstall

  @SPYG-499
  Scenario: Cluster Uninstall via Package Manager
    Given the cluster has MapR Installed
    And I remove all non-core components
    And I stop all "mapr-warden" services
    And I stop all "mapr-zookeeper" services
    And I remove all the core components
    And I clear all mapr data
    Then the cluster does not have MapR Installed


