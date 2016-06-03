Feature: ElasticSearch Setup

  @SPYG-514
  Scenario: Setup ElasticSearch once MapR is Installed
    Given the cluster has MapR Installed
    And I run loadTemplate on one of the es nodes


