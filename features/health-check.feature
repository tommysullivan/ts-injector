Feature: Health Check

  @SPYG-143 @SPYG-123
  Scenario: Post-Install Health Check
  Given I have installed Spyglass
  When I run the Post-Install Health Check
  Then it verifies connectivity to the following services:
  | MCS |
  | Kibana |
  | Grafana |
  | OpenTSDB |
  | ElasticSearch |

  #TODO: Force failure and ensure health check is correct
  #TODO: Implement using Warden and Zookeeper