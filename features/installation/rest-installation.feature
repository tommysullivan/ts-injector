Feature: REST Installation

  @SPYG-282 @maprSetup
  Scenario: Download and Run GUI Installer
    Given the cluster does not have MapR Installed
    When I ssh into the node hosting "mapr-installer"
    And within my ssh session, I download "/mapr-setup.sh" to "/tmp" from the repository for the "mapr-installer" package family
    And within my ssh session, I execute "/tmp/mapr-setup.sh -y -u [installerRepoURL] [maprCoreRepoURL] [ecosystemRepoURL]"
    And I wait "15" seconds
    Then it successfully starts the installer web server and outputs its URL to the screen

  @SPYG-282 @restInstaller
  Scenario: Use REST APIs to Install MapR with Spyglass Components
    Given I can authenticate my GUI Installer Rest Client
    And I specify and save the desired Cluster Configuration
    When I perform Cluster Configuration Verification
    And I perform Cluster Provisioning
    Then I perform Cluster Installation