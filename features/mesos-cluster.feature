Feature: Mesos Cluster Feature

  @docker
  Scenario: Test run on mesos cluster
    Given I am able to access mesos cluster host
    And I run the following shell command on docker node
    """
    ls -l /root/
    """

  @docker
  Scenario: Test access multi node mesos cluster
    Given I am able to access all mesos cluster host
    And I run the following shell command on docker all nodes
    """
    ls -l /root/
    """