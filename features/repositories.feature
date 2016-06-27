Feature: Repositories
  As a Test Framework User
  In order to determine the appropriate repository url for a given package version, promotion level and OS
  I use the repositories capability of the packaging library

  @regression
  Scenario: Get list of packages in a repository
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
    And I am using a repositories collection based on the following configuration:
    """
    [
      {
        "url": "http://repositoryUrl",
        "packages": [
          { "packageSetRef": "exampleSet1", "version": "1.0.0", "promotionLevel": "dev", "operatingSystems": ["redhat", "centos"]},
          { "package": "somePackage", "version": "1.1.0", "promotionLevel": "production", "operatingSystems": ["ubuntu"]}
        ]
      }
    ]
    """
    When I ask for the packages with repository url "http://repositoryUrl"
    Then package "0" is named "example1" with version "1.1", promotionLevel "dev" and operating system "redhat"
    Then package "1" is named "example2" with version "1.2", promotionLevel "dev" and operating system "redhat"
    Then package "2" is named "example3" with version "1.3", promotionLevel "dev" and operating system "redhat"
    Then package "3" is named "somePackage" with version "1.1.0", promotionLevel "production" and operating system "ubuntu"
    Given I want the "1.1" version of the "example1" package
    And I want the version that was promoted to the "dev" level of the development lifecycle
    And I am using the "centos" operating system
    When I ask for the repository
    Then the repository has the correct url of "http://repositoryUrl"