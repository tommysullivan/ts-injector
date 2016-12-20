Feature: Cluster Service feature

  @regression
  Scenario: Node service are obtained correctly
    Given The services for a node are set based on the following JSON
    """
     {
          "name": "scale-72",
          "username": "root",
          "password": "mapr",
          "host": "10.10.10.100",
          "operatingSystem": {
            "name": "CentOS",
            "version": "6.5"
          },
          "serviceNames": [
            "mapr-fileserver",
            "mapr-core"
          ]
        }
    """
    Then I verify the service names for above node are
    """
    mapr-fileserver
    mapr-core
    """

  @regression
  Scenario: Node service are obtained correctly
    Given I have the service groups defined according to the following json
    """
    {
      "serviceGroups": [
        {
          "id": "test-control",
          "serviceNames": [
            "mapr-fileserver",
            "mapr-core"
          ]
        }
      ]
     }
    """
    Given The services for a node are set based on the following JSON
    """
     {
          "name": "scale-72",
          "username": "root",
          "password": "mapr",
          "host": "10.10.10.100",
          "operatingSystem": {
            "name": "CentOS",
            "version": "6.5"
          },
          "serviceNames": [
            {"serviceGroupRef": "test-control"},
            "mapr-resourcemanager"
          ]
     }
    """
    Then I verify the service names for above node are
    """
    mapr-fileserver
    mapr-core
    mapr-resourcemanager
    """