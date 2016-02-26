Feature: MCS

  @HealthCheck @SPYG-123 @SPYG-143
  Scenario Outline: Spyglass Services appear Healthy in MCS after Installation
    Given I have installed Spyglass onto "<operating system>"
    And my MCS username is "mapr"
    And my MCS password is "mapr"
    And I have an authenticated MCS Rest Client Session
    When I use the MCS Rest Client Session to retrieve dashboardInfo
    And I ask the dashboardInfo for unhealthySpyglassServices
    Then I do not see any unhealthy spyglass services

  Examples:
    | operating system |
    | SuSE 12          |
    | CentOS 7         |
    | Ubuntu 12.04     |

  Scenario Outline: Spyglass Health Check Negative Testing
    Given I want to make sure the health check is accurate
    When I purposely take down <service> on one or more nodes
    And I ask the dashboardInfo for unhealthySpyglassServices
    Then I see that <service> is in the list within "16" seconds
    Examples:
      | service |
      | collectd |
      | fluentd  |
      | elasticsearch |
      | opentsdb |
      | kibana |
      | grafana |

  @HealthCheck @SPYG-126
  Scenario Outline: MCS 3rd Party UI Links
    Given I have installed Spyglass onto "<operating system>"
    And my MCS username is "mapr"
    And my MCS password is "mapr"
    And I have an authenticated MCS Rest Client Session
    When I ask for a link to the following applications:
      | application |
      | grafana     |
      | kibana      |
    Then I receive a URL for each application
    And a GET request of each URL does not return an error status code

    @SPYG-193
      Examples:
        | operating system |
        | SuSE 12          |

    @SPYG-191
      Examples:
        | operating system |
        | CentOS 7         |

    @SPYG-192
      Examples:
        | operating system |
        | Ubuntu 12.04     |
