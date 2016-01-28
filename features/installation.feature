@draft @p1
Feature: Installation

  Background:
    Given I am a MapR Employee
    And I want to install MapR Core, YARN and Spyglass for Testing or Demo Purposes
    And I restrict myself to a single node cluster running one the following Operating Systems:
      | CentOS 7 |
      | Ubuntu 12.04 |
      | SUSE 12      |
    And I restrict that node to run in one of the following ways:
      | on premise bare metal |
      | in a Docker container running in Mac OSX |
      | in a Docker container running in On Premise Bare Metal |
      | in a Docker container running in AWS     |

  @SPYG-123
  Scenario: Manual Installation
    When I navigate to "https://github.com/mapr/private-spyglass"
    Then I will find instructions that enable me, without any advanced knowledge, to:
      | prepare the hardware |
      | install desired version(s) of MapR Core, YARN and Spyglass    |
      | run all services required for spyglass |
      | discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch |

  @SPYG-123
  @SPYG-143
  Scenario: Post-Install Health Check
    Given I have installed Spyglass
    When I run the Post-Install Health Check
    Then it verifies connectivity to the following services:
      | MCS |
      | Kibana |
      | Grafana |
      | OpenTSDB |
      | ElasticSearch |

  @SPYG-142
  # TODO: Once we get the manual instructions, we can be more specific in the below Gherkin.
  Scenario: Automated Setup Script
    When I clone the "https://github.com/mapr/private-spyglass" repo
    And I run the "install.sh" script with appropriate config / CLI options
    Then it will install spyglass in the desired way
    And it will run the Post-Install Health Check