Feature: Spyglass Releasing
  As a Spyglass Stakeholder
  In order to ensure the correct package version combinations are tested during all phases of development
  I define in config.json the package combinations to test for each phase of each release lifecycle

  Scenario: Basic Release Scenario
    Given I am using the default packageSets and repositories collection
    And I am using the default releases collection
    When I ask for packages for the "development" phase of the "spyglass-ga" release
    Then package "0" is named "mapr-hbase-common" with version "1.1", promotionLevel "development"