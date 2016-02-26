Feature: Kibana Logs

  @SPYG-125 @Manual
  Scenario Outline: View Warden Log in Discovery Tab
    Given I have installed Spyglass onto "<operating system>"
    And I have determined the kibana server and port for that cluster
    When I navigate to kibana's discovery interface
    Then I see at least one log from warden

  @SPYG-208
  Examples:
  | operating system |
  | SuSE 12          |

  @SPYG-206
  Examples:
  | operating system |
  | CentOS 7         |

  @SPYG-207
  Examples:
  | operating system |
  | Ubuntu 12.04     |