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
    Then it verifies connectivity to MCS, Kibana, Grafana, OpenTSDB and ElasticSearch

  @SPYG-142
    # TODO: Once we get the manual instructions, we can be more specific in the below Gherkin.
  Scenario: Automated Setup Script
    When I clone the "https://github.com/mapr/private-spyglass" repo
    And I run the "install.sh" script with appropriate config / CLI options
    Then it will install spyglass in the desired way

  # Product Questions:
  # Q: What are the details of how spyglass ui installer would work? (see below scenarios for details)
  # Q: What versions and OS's are supported in each beta
  # A: Prashant will ask this in the beta questionnaire and get back to us
  # Q: Will we support spyglass on "secure cluster"? (auth via mapr login / kerberos plus tickets)
  # A: Maybe? Very unclear and sounds like there are some open quesitons about it

  # Technical Questions:
  # Q: Can we get this sooner? The earlier we can get it, the easier it is to install and udpate the test
  #    environment as the software continues to be developed. We can parallelize work earlier. We also
  #    want a separate demo / acceptance environment so that both QA and dev are not interfered with and so
  #    that demos are not risked due to ongoing changes from testing and development processes.

  Scenario: Select / Deselect Spyglass as a Component within GUI Installer
    Given I am using "~> 5.1.0" of the GUI installer
    When I arrive at the component selection
    Then I can select "Spyglass" as a component

  Scenario: See / move location of "Spyglass Components"
    * These may be named generically ie "Spyglass Collector" and "Spyglass Data Store"
    * These may be named using implementation detail component names ie "collectd" and "ElasticSearch"
    * There may be constraints on where these live, which would need to be implemented server and/or client side