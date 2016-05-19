Feature: Grafana Dashboard Import

  @SPYG-124
  Scenario: Grafana Dashboard Definition Import
    Given I have installed Spyglass
    And I have determined the grafana server and port for that cluster
    And my grafana username is "admin"
    And my grafana password is "admin"
    And I have an authenticated grafana rest client
    When I request to import the following dashboard definitions:
      | dashboard name |
      | cldb           |
      | dbmetrics      |
      | node           |
      | volume         |
      | yarn           |
    Then the reports are all available to view