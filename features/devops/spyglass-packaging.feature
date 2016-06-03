Feature: Spyglass Packaging
  As a Spyglass Engineer
  In order to ensure the correct spyglass and related component repositories are configured correctly
  I configure the repositories and then validate many of the common package locations

  @regression
  Scenario Outline: Given a desired package details, determine the correct repository
    Given I am using the default packageSets and repositories collection
    And I want the "<version>" version of the "<package name>" package
    And I want the version that was promoted to the "<promotion level>" level of the development lifecycle
    And I am using the "<operating system>" operating system
    When I ask for the repository
    Then the repository has the correct url of "<appropriate repository url>"
    Examples:
      | package name      | version              | promotion level | operating system | appropriate repository url                                     |
      | mapr-core         | 5.1.0                | production      | ubuntu           | http://package.mapr.com/releases/v5.1.0/ubuntu                 |
      | mapr-core         | 5.2.0                | development     | ubuntu           | http://apt.qa.lab/mapr                                         |
      | mapr-hbase-common | 1.1                  | production      | ubuntu           | http://package.mapr.com/releases/v5.1.0/ubuntu                 |
      | mapr-hbase-rest   | 1.1                  | production      | ubuntu           | http://package.mapr.com/releases/v5.1.0/ubuntu                 |
      | mapr-core         | 5.1.0                | production      | redhat           | http://package.mapr.com/releases/v5.1.0/redhat                 |
      | mapr-core         | 5.1.0                | production      | suse             | http://package.mapr.com/releases/v5.1.0/suse                   |
      | mapr-core         | 5.2.0                | development     | Ubuntu           | http://apt.qa.lab/mapr                                         |
      | mapr-core         | 5.2.0                | development     | suse             | http://yum.qa.lab/mapr-suse                                    |
      | mapr-core         | 5.2.0                | development     | redhat           | http://yum.qa.lab/mapr                                         |
      | mapr-patch        | 5.1.0.37549.GA-38317 | active-beta     | ubuntu           | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | mapr-patch        | 5.1.0.37549.GA-38317 | active-beta     | redhat           | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/redhat |
      | mapr-asynchbase   | 1.7.0                | production      | ubuntu           | http://package.mapr.com/releases/ecosystem-5.x/ubuntu          |
      | mapr-asynchbase   | 1.7.0                | production      | redhat           | http://package.mapr.com/releases/ecosystem-5.x/redhat          |
      | mapr-asynchbase   | 1.7.0                | production      | suse             | http://package.mapr.com/releases/ecosystem-5.x/suse            |
      | mapr-grafana      | 2.6.0                | active-beta     | ubuntu           | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | mapr-grafana      | 2.6.0                | active-beta     | redhat           | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/redhat |
      | mapr-grafana      | 3.0.4                | active-beta     | ubuntu           | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | mapr-grafana      | 3.0.4                | active-beta     | redhat           | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/redhat |
      | mapr-grafana      | 3.0.4                | testing         | ubuntu           | http://apt.qa.lab/opensource/spyglass-beta                     |
      | mapr-grafana      | 3.0.4                | testing         | redhat           | http://yum.qa.lab/opensource/spyglass-beta                     |
      | mapr-grafana      | 3.0.4                | development     | ubuntu           | http://apt.qa.lab/opensource                                   |
      | mapr-fluentd      | 0.12.26              | active-beta     | ubuntu           | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | mapr-fluentd      | 0.14.00              | development     | ubuntu           | http://apt.qa.lab/opensource                                   |
      | mapr-grafana      | 3.0.4                | development     | redhat           | http://yum.qa.lab/opensource                                   |
      | mapr-installer    | 1.2.0                | production      | ubuntu           | http://package.mapr.com/releases/installer/ubuntu              |
      | mapr-installer    | 1.2.0                | production      | redhat           | http://package.mapr.com/releases/installer/redhat              |
      | mapr-installer    | 1.3.0                | development     | ubuntu           | http://apt.qa.lab/installer-master-ui                          |
      | mapr-installer    | 1.3.0                | development     | redhat           | http://yum.qa.lab/installer-master-ui                          |