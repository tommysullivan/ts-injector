Feature: SSH Library
  As a user
  In order to use typescript to asynchronously perform SSH operations
  I use the SSH Library's APIs

  Scenario: Run arbitrary commands on nodes that host a cluster
    When I run the following commands on nodes hosting "mapr-cldb" in the cluster:
    """
    maprcli node cldbmaster
    """