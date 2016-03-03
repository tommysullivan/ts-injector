Feature: ElasticSearch Logs

  @SPYG-125 @HealthCheck
  Scenario Outline: Warden Logs present in ES Query
    Given I have installed Spyglass onto "<operating system>"
    When I query for logs for index "logstash-*"
    Then I see at least a single log containing the word "warden"

    Examples:
    | operating system |
    | SuSE 12          |
    | CentOS 7         |
    | Ubuntu 12.04     |