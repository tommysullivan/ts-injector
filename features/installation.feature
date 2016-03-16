Feature: Installation
  As a Spyglass Customer
  In order to install a Spyglass-enabled MapR Cluster
  I use one of the following installation methods

  @SPYG-123 @Manual
  Scenario: Manual Installation
    When I follow the manual installation instructions located at "https://github.com/mapr/private-spyglass"
    Then it tells me how to install, configure and run the services required for Spyglass
    And it tells me how to discover the URLs for MCS, Kibana, Grafana, OpenTSDB and ElasticSearch

  @SPYG-282 @mapr-setup
  Scenario: Download and Run GUI Installer
    Given the cluster does not have MapR Installed
    When I ssh into the node hosting "GUI Installer"
    And within my ssh session, I download "/mapr-setup.sh" to "/tmp" from the "GUI Installer" repo
    And within my ssh session, I execute "/tmp/mapr-setup.sh -y -u [installerRepoURL] [maprCoreRepoURL] [ecosystemRepoURL]"
    And I wait "15" seconds
    Then it successfully starts the installer web server and outputs its URL to the screen

  @SPYG-282 @rest-installer
  Scenario: Use REST APIs to Install MapR with Spyglass Components
    Given the GUI Installer web server is running
    And I can authenticate my GUI Installer Rest Client
    And I specify the desired Cluster Configuration
    When I perform Cluster Configuration Verification
    Then Cluster Configuration Verification completes without errors
    When I perform Cluster Provisioning
    Then Cluster Provisioning completes without errors
    When I perform Cluster Installation
    Then Cluster Installation completes without errors

  @SPYG-282 @Manual
  Scenario: Use Web Interface to Install MapR with Spyglass Components
    Given the GUI Installer web server is running
    And I can authenticate my browser using the GUI Installer Login Page
    When I indicate I want a basic installation with Spyglass components and their dependencies only
    Then the website indicates that the installation succeeds within "5" minutes