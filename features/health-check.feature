Feature: Health Check

  @SPYG-143 @SPYG-123
  Scenario: Post-Install Health Check
    Given I have a Spyglass-enabled Cluster (IPs specified in configuration)
    And I have discovered the url for Zookeeper REST service
    And the following services are put into an arbitrary combination of "healthy" or "not healthy" state
      | MCS |
      | Kibana |
      | Grafana |
      | OpenTSDB |
      | ElasticSearch |
    When I query any Zookeeper's REST Service for health of said services
    Then Zookeeper's answers on the health of said services are consistent with my expectations
    And if this does not happen right away, it should happen within "10" seconds at most