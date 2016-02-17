Feature: Installation
  As a MapR Employee
  In order to test and demo Spyglass before it is available in the UI installer
  I install Spyglass on top of a previously prepared MapR Cluster

  Background:
    Given the cluster under test is a single node cluster

  @SPYG-123 @Manual
  Scenario Outline: Manual Installation
    Given I have manually prepared a single node cluster as described by "single-node-cluster-prep.feature"
    And the node is running <operating system> <version>
    When I read the readme at "https://github.com/mapr/private-spyglass"
    Then it tells me how to install, configure and run the services required for Spyglass
    And it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch
    Examples:
      | operating system | version |
      | CentOS           | 7       |
      | Ubuntu           | 12.04   |
      | SUSE             | 12      |

  @SPYG-123 @SPYG-142
  Scenario Outline: Automated Installation for QA Purposes
    Given I have automatically prepared a single node cluster as described by "single-node-cluster-prep.feature"
    Given the node is running <operating system> <version>
    And I prepare it using automation described by "single-node-cluster-prep.feature"
    When I run the Spyglass installer
    And I subsequently run the health check described by "health-check.feature"
    Then the health check passes
    Examples:
      | operating system | version |
      | CentOS           | 7       |
      | Ubuntu           | 12.04   |
      | SUSE             | 12      |

  @SPYG-124
  # TODO: Grafana REST API yields 404 upon import - determine why
  Scenario: Grafana Dashboard Definition Import
    Given I have a grafana server and port set to "http://10.10.1.103:3000"
    And my grafana username is "admin"
    And my grafana password is "admin"
    And the fqdns of my cluster are
      | fqdns       |
      | 10.10.1.102 |
    And I have an authenticated grafana rest client
    When I request to import the following dashboard definitions:
      | dashboard name |
      | cldb           |
      | dbmetrics      |
      | node           |
      | volume         |
      | yarn           |
    Then the reports are all available to view

  @Manual
  Scenario: Install on Suse 12
