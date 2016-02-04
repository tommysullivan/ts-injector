Feature: Installation
  As a MapR Employee
  In order to test and demo Spyglass before it is available in the UI installer
  I install Spyglass on top of a previously prepared MapR Cluster

  Background:
    Given the cluster under test is a single node cluster

  @SPYG-123 @Manual
  Scenario Outline: Manual Installation
    Given the node is running <operating system> <version>
    And I have manually prepared it as described by "single-node-cluster-prep.feature"
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
    Given the node is running <operating system> <version>
    And I prepare it using automation described by "single-node-cluster-prep.feature"
    And I
    Examples:
      | operating system | version |
      | CentOS           | 7       |
      | Ubuntu           | 12.04   |
      | SUSE             | 12      |
