Feature: Manually Install Using Github Docs

  @SPYG-123 @Manual
  Scenario:
    When I follow the manual installation instructions located at "https://github.com/mapr/private-spyglass"
    Then it tells me how to install, configure and run the services required for Spyglass
    And it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch