Feature: Package Manager Uninstall

  @SPYG-514
  Scenario: Setup ElasticSearch once MapR is Installed
    Given the cluster has MapR Installed
    And I run loadTemplate one of the es nodes


