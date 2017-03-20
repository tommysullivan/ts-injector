Feature: Verify Package Metadata

  @packageMetadata
  Scenario: Verify package metadata for Installed Packages
    Given the cluster has MapR Installed
#    And I query all the installed packages for the "Tag" metadata
#    And I query all the installed packages for the "Commit" metadata
    And I query all the installed packages on "CentOS" for the "Signature" metadata