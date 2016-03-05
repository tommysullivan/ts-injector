@JIRA-23
Feature: Installation
  As a Spyglass Customer
  In order to install a Spyglass-enabled MapR Cluster
  I use one of the following installation methods

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

  @SPYG-282
  Scenario: ESXi Hardware Preparation
    Given I have an esxi server running at "10.10.1.100"
    And the esxi username is "root"
    And the esxi password is "maprwins"
    And the ID of the VM I'd like to prepare is "1187"
    And the ID of the snapshot I'd like to apply is "3"
    When I apply the snapshot to the VM
    And I wait "30" seconds
    Then I can connect to it and find that it does not have MapR installed

#  @SPYG-282
#  Scenario: Download and Run Installer Shell Script
#    Given I have procured hardware running "CentOS 7"
#    When I log onto one of the machines
#    And I use HTTP GET to pull the "latest" version of "mapr_setup.sh" from the "build" repo
#    And I execute it, pointing it at the "build" repositories
#    And I provide all the default values to the interactive shell
#    Then it successfully starts the installer web server and outputs its URL to the screen

#  @SPYG-282
#  Scenario: Use REST APIs to Install MapR with Spyglass Components
#    Given the GUI Installer web server is running
#    And I can authenticate my GUI Installer Rest Client
#    When I make the necessary REST calls
#    Then the REST API indicates that the installation succeeds within "5" minutes
#
#  @SPYG-282
#  Scenario: Use Web Interface to Install MapR with Spyglass Components
#    Given the GUI Installer web server is running
#    And I can authenticate my browser using the GUI Installer Login Page
#    When I indicate I want a basic installation with Spyglass components and their dependencies only
#    Then the website indicates that the installation succeeds within "5" minutes
#
#  Scenario: Install MapR Core and Spyglass at the same time
#  Scenario: Install MapR Core, then install Spyglass on top