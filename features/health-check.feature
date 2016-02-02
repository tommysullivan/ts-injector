Feature: Health Check

  @SPYG-143 @SPYG-123
  Scenario: Post-Install Health Check
    Given I have a healthy Spyglass-enabled Single Node Cluster
    And I have authenticated MCS Client
    When I query MCS Dashboard Info API
    Then I find the following services are running:
      | collectd |
      | elasticsearch |
      | kibana        |
      | grafana       |
      | fluentd       |
      | opentsdb      |