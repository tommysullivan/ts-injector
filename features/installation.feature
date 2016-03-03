@JIRA-23
Feature: Installation
  As a MapR Employee
  In order to test and demo Spyglass before it is available in the UI installer
  I install Spyglass on top of a previously prepared MapR Cluster

  @SPYG-123 @Manual
  Scenario Outline: Manual Installation
    Given I have procured hardware running "<operating system>"
    When I follow the manual installation instructions located at "https://github.com/mapr/private-spyglass"
    Then it tells me how to install, configure and run the services required for Spyglass
    And it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch

      @SPYG-187
      Examples:
      | operating system |
      | CentOS 7         |

      @SPYG-186
      Examples:
      | operating system |
      | Ubuntu 12.04     |

      @SPYG-195
      Examples:
      | operating system |
      | SUSE 12          |

  Scenario: Install MapR Core and Spyglass at the same time
  Scenario: Install MapR Core, then install Spyglass on top