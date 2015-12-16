Feature: Trigger Cluster Behaviors

  Scenario Outline: I can trigger various system scenarios during demo via push button so we can see reaction in graphs
    Given I am in demo mode
    When I push the button for "trigger system behavior"
    And I push another button for one of the listed <behaviors>
    Then that behavior occurs and I see it on the dashboards within "30" seconds
    Examples:
