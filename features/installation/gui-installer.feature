Feature: GUI Installation

  @SPYG-282 @Manual
  Scenario: Use Web Interface to Install MapR with Spyglass Components
    Given the GUI Installer web server is running
    And I can authenticate my browser using the GUI Installer Login Page
    When I indicate I want a basic installation with Spyglass components and their dependencies only
    Then the website indicates that the installation succeeds within "5" minutes