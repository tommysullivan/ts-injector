Feature: Releasing
  As a Test Framework User
  In order to test against the exact set of component versions and their corresponding promotion levels
  I use the releases capability of the packaging library

  @regression
  Scenario: Basic Release Scenario
    Given I am using a packageSets collection based on the following configuration:
    """
    [
      {
        "id": "exampleSet1",
        "version": "1.0.0",
        "packages": [
          { "name": "example1", "version": "1.1" },
          { "name": "example2", "version": "1.2" },
          { "packageSetRef": "exampleSet2", "version": "2.1.0" }
        ]
      },
      {
        "id": "exampleSet2",
        "version": "2.1.0",
        "packages": [
          { "name": "example3", "version": "1.3" }
        ]
      }
    ]
    """
    And I am using a releases collection based on the following configuration:
    """
    [
      {
        "name": "example-release",
        "phases": [
          {
            "name": "active-beta",
            "packages": [
              { "packageSetRef": "exampleSet1", "version": "1.0.0", "promotionLevel": "active-beta" },
              { "name": "example4", "version": "latest", "promotionLevel": "production", "operatingSystems": ["ubuntu"] }
            ]
          }
        ]
      }
    ]
    """
    When I ask for packages for the "active-beta" phase of the "example-release" release
    Then package "0" is named "example1" with version "1.1", promotionLevel "active-beta"
    Then package "1" is named "example2" with version "1.2", promotionLevel "active-beta"
    Then package "2" is named "example3" with version "1.3", promotionLevel "active-beta"
    Then package "3" is named "example4" with version "latest", promotionLevel "production"