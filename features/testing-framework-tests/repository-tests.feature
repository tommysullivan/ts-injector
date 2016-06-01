Feature: Package Repositories
  As a Spyglass Consumer
  In order to find packages based on release, phase of development, operating system, version and pakage family (spyglass, core, etc)
  I configure my package manager to use the appropriate repository url

  Scenario Outline: MapR Core Family of Package Repositories
    Given it is the "<phase>" phase of the development lifecycle
    And we are targeting the "<release target>" release
    And the MapR Core version is "<core version>"
    And we are using the "<OS Family>" family of Operating Systems
    When I ask for the repository url for the "core" component family
    Then I receive the appropriate repository url of "<appropriate repository url>"
    When I ask for the repository configuration file content for the "core" component family
    Then it contains the url "<appropriate repository url>"
    When I ask for the repository configuration file location for the "core" component family
    Then it contains a valid filename
    Examples:
      | release target | phase      | core version | OS Family | appropriate repository url                             |
      | 5.1.0 GA       | production | 5.1.0        | ubuntu    | http://package.mapr.com/releases/v5.1.0/ubuntu         |
      | 5.1.0 GA       | production | 5.1.0        | redhat    | http://package.mapr.com/releases/v5.1.0/redhat         |
      | 5.1.0 GA       | production | 5.1.0        | suse      | http://package.mapr.com/releases/v5.1.0/suse           |
      | 5.2.0 GA       | production | 5.2.0        | ubuntu    | http://package.mapr.com/releases/v5.2.0/ubuntu         |
      | 5.2.0 GA       | production | 5.2.0        | redhat    | http://package.mapr.com/releases/v5.2.0/redhat         |
      | 5.2.0 GA       | production | 5.2.0        | suse      | http://package.mapr.com/releases/v5.2.0/suse           |
      | 5.2.0 GA       | staging    | 5.2.0        | ubuntu    | http://maprqa:maprqa@stage.mapr.com/mapr/v5.2.0/ubuntu |
      | 5.2.0 GA       | staging    | 5.2.0        | redhat    | http://maprqa:maprqa@stage.mapr.com/mapr/v5.2.0/redhat |
      | 5.2.0 GA       | staging    | 5.2.0        | suse      | http://maprqa:maprqa@stage.mapr.com/mapr/v5.2.0/suse   |
      | 5.2.0 GA       | dev        | 5.2.0        | ubuntu    | http://apt.qa.lab/mapr                                 |
      | 5.2.0 GA       | dev        | 5.2.0        | redhat    | http://yum.qa.lab/mapr                                 |
      | 5.2.0 GA       | dev        | 5.2.0        | suse      | http://yum.qa.lab/mapr-suse                            |

  Scenario Outline: Ecosystem Family of Package Repositories
    Given it is the "<phase>" phase of the development lifecycle
    And we are targeting the "<release target>" release
    And the MapR Core version is "<core version>"
    And we are using the "<OS Family>" family of Operating Systems
    When I ask for the repository url for the "ecosystem" component family
    Then I receive the appropriate repository url of "<appropriate repository url>"
    When I ask for the repository configuration file content for the "ecosystem" component family
    Then it contains the url "<appropriate repository url>"
    When I ask for the repository configuration file location for the "ecosystem" component family
    Then it contains a valid filename
    Examples:
      | release target | phase      | core version | OS Family | appropriate repository url                                    |
      | ecosystem-1604 | production | 5.1.0        | ubuntu    | http://package.mapr.com/releases/ecosystem-5.x/ubuntu         |
      | ecosystem-1604 | production | 5.1.0        | redhat    | http://package.mapr.com/releases/ecosystem-5.x/redhat         |
      | ecosystem-1604 | production | 5.1.0        | suse      | http://package.mapr.com/releases/ecosystem-5.x/suse           |
      | ecosystem-1605 | production | 5.1.0        | ubuntu    | http://package.mapr.com/releases/ecosystem-5.x/ubuntu         |
      | ecosystem-1605 | production | 5.1.0        | redhat    | http://package.mapr.com/releases/ecosystem-5.x/redhat         |
      | ecosystem-1605 | production | 5.1.0        | suse      | http://package.mapr.com/releases/ecosystem-5.x/suse           |
      | ecosystem-1605 | staging    | 5.1.0        | ubuntu    | http://maprqa:maprqa@stage.mapr.com/mapr/ecosystem-5.x/ubuntu |
      | ecosystem-1605 | staging    | 5.1.0        | redhat    | http://maprqa:maprqa@stage.mapr.com/mapr/ecosystem-5.x/redhat |
      | ecosystem-1605 | staging    | 5.1.0        | suse      | http://maprqa:maprqa@stage.mapr.com/mapr/ecosystem-5.x/suse   |
      | ecosystem-1605 | dev        | 5.1.0        | ubuntu    | http://apt.qa.lab/opensource                                  |
      | ecosystem-1605 | dev        | 5.1.0        | redhat    | http://yum.qa.lab/opensource                                  |
      | ecosystem-1605 | dev        | 5.1.0        | suse      | http://yum.qa.lab/opensource                                  |

  Scenario Outline: Spyglass Family of Package Repositories
    Given it is the "<phase>" phase of the development lifecycle
    And we are targeting the "<release target>" release
    And the MapR Core version is "<core version>"
    And we are using the "<OS Family>" family of Operating Systems
    When I ask for the repository url for the "spyglass" component family
    Then I receive the appropriate repository url of "<appropriate repository url>"
    When I ask for the repository configuration file content for the "spyglass" component family
    Then it contains the url "<appropriate repository url>"
    When I ask for the repository configuration file location for the "spyglass" component family
    Then it contains a valid filename
    Examples:
      | release target        | phase        | core version | OS Family | appropriate repository url                                     |
      | spyglass beta         | limited beta | 5.1.0        | ubuntu    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | spyglass beta         | limited beta | 5.1.0        | redhat    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/redhat |
      | spyglass beta refresh | limited beta | 5.1.0        | ubuntu    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | spyglass beta refresh | limited beta | 5.1.0        | redhat    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/redhat |
      | spyglass beta refresh | staging      | 5.1.0        | ubuntu    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | spyglass beta refresh | staging      | 5.1.0        | redhat    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/redhat |
      | spyglass beta refresh | dev          | 5.1.0        | ubuntu    | http://apt.qa.lab/opensource/spyglass-beta                     |
      | spyglass beta refresh | dev          | 5.1.0        | redhat    | http://yum.qa.lab/opensource/spyglass-beta                     |
      #NOTE: All future Spyglass releases will occur as a subset of MEP releases

  Scenario Outline: MEP Family of Package Repositories
    Given it is the "<phase>" phase of the development lifecycle
    And we are targeting the "<release target>" release
    And the MapR Core version is "<core version>"
    And we are using the "<OS Family>" family of Operating Systems
    When I ask for the repository url for the "MEP" component family
    Then I receive the appropriate repository url of "<appropriate repository url>"
    When I ask for the repository configuration file content for the "MEP" component family
    Then it contains the url "<appropriate repository url>"
    When I ask for the repository configuration file location for the "MEP" component family
    Then it contains a valid filename
    Examples:
      | release target | phase      | core version | OS Family | appropriate repository url                                                                |
      | MEP 1.0.0      | production | 5.2.0        | ubuntu    | http://package.mapr.com/releases/MEP/MEP-1.0.0/ubuntu                                     |
      | MEP 1.0.0      | production | 5.2.0        | redhat    | http://package.mapr.com/releases/MEP/MEP-1.0.0/redhat                                     |
      | MEP 1.0.0      | production | 5.2.0        | suse      | http://package.mapr.com/releases/MEP/MEP-1.0.0/suse                                       |
      | MEP 1.0.0      | staging    | 5.2.0        | ubuntu    | http://maprqa:maprqa@stage.mapr.com/mapr/MEP/MEP-1.0.0/ubuntu                             |
      | MEP 1.0.0      | staging    | 5.2.0        | redhat    | http://maprqa:maprqa@stage.mapr.com/mapr/MEP/MEP-1.0.0/redhat                             |
      | MEP 1.0.0      | staging    | 5.2.0        | suse      | http://maprqa:maprqa@stage.mapr.com/mapr/MEP/MEP-1.0.0/suse                               |
      | MEP 1.0.0      | dev        | 5.2.0        | ubuntu    | http://artifactory.devops.lab/artifactory/list/prestage/releases-dev/MEP/MEP-1.0.0/ubuntu |
      | MEP 1.0.0      | dev        | 5.2.0        | redhat    | http://artifactory.devops.lab/artifactory/list/prestage/releases-dev/MEP/MEP-1.0.0/redhat |
      | MEP 1.0.0      | dev        | 5.2.0        | suse      | http://artifactory.devops.lab/artifactory/list/prestage/releases-dev/MEP/MEP-1.0.0/suse   |

  Scenario Outline: Core Patch Family of Package Repositories
    Given it is the "<phase>" phase of the development lifecycle
    And we are targeting the "<release target>" release
    And the MapR Core version is "<core version>"
    And we are using the "<OS Family>" family of Operating Systems
    When I ask for the repository url for the "mapr-patch" component family
    Then I receive the appropriate repository url of "<appropriate repository url>"
    When I ask for the repository configuration file content for the "mapr-patch" component family
    Then it contains the url "<appropriate repository url>"
    When I ask for the repository configuration file location for the "mapr-patch" component family
    Then it contains a valid filename
    Examples:
      | release target        | phase        | core version | OS Family | appropriate repository url                                     |
      | spyglass beta refresh | limited beta | 5.1.0        | ubuntu    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/ubuntu |
      | spyglass beta refresh | limited beta | 5.1.0        | redhat    | http://spyglass:monitoring@stage.mapr.com/beta/spyglass/redhat |
      | spyglass beta refresh | dev          | 5.1.0        | ubuntu    | http://apt.qa.lab/v5.1.0-spyglass                              |
      | spyglass beta refresh | dev          | 5.1.0        | redhat    | http://yum.qa.lab/v5.1.0-spyglass                              |

  Scenario Outline: Installer Family of Package Repositories
    Given it is the "<phase>" phase of the development lifecycle
    And we are targeting the "<release target>" release
    And the MapR Core version is "<core version>"
    And we are using the "<OS Family>" family of Operating Systems
    When I ask for the repository url for the "installer" component family
    Then I receive the appropriate repository url of "<appropriate repository url>"
    When I ask for the repository configuration file content for the "installer" component family
    Then it contains the url "<appropriate repository url>"
    When I ask for the repository configuration file location for the "installer" component family
    Then it contains a valid filename
    Examples:
      | release target | phase      | core version | OS Family | appropriate repository url                                |
      | installer 1.3  | production | 5.2          | ubuntu    | http://package.mapr.com/releases/installer/ubuntu         |
      | installer 1.3  | production | 5.2          | redhat    | http://package.mapr.com/releases/installer/redhat         |
      | installer 1.3  | staging    | 5.2          | ubuntu    | http://maprqa:maprqa@stage.mapr.com/mapr/installer/ubuntu |
      | installer 1.3  | staging    | 5.2          | redhat    | http://maprqa:maprqa@stage.mapr.com/mapr/installer/redhat |
      | installer 1.3  | dev        | 5.2          | ubuntu    | http://apt.qa.lab/installer-master-ui                     |
      | installer 1.3  | dev        | 5.2          | redhat    | http://yum.qa.lab/installer-master-ui                     |