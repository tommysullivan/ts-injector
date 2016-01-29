Feature: Health Check

  @SPYG-143 @SPYG-123
  Scenario: Post-Install Health Check
  Given I have installed Spyglass
  And I restrict myself to a single node cluster running one the following Operating Systems:
    | CentOS 7 |
    | Ubuntu 12.04 |
    | SUSE 12      |
  And I restrict that node to run in one of the following ways:
    | on premise bare metal |
    | in a Docker container running in Mac OSX |
    | in a Docker container running in On Premise Bare Metal |
    | in a Docker container running in AWS     |
  And I have discovered the url for Zookeeper REST service
  And zero or more of the following services are put into what should be considered a "healthy" or "not healthy" state
    | MCS |
    | Kibana |
    | Grafana |
    | OpenTSDB |
    | ElasticSearch |
  When I query any Zookeeper's REST Service for health of said services
  Then Zookeeper's answers on the health of said services are consistent with my expectations
  And if this does not happen right away, it should happen within "10" seconds at most