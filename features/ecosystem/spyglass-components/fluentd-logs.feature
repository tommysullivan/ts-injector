@logs
Feature: FluentD Logs

  @wipFlu
  Scenario: Verify FluentD logs are parsed
    Given I have installed Spyglass
    And the service of interest is "mapr-fluentd"
    And the log file for the service is located at "/opt/mapr/fluentd/fluentd-0.12.22/var/log/fluentd/fluentd.log"
    When I append "5" fake log lines containing a string with the following format:
    """
    mapr-fluentd-{testRunGUID}-{lineNumber}
    """
    And I wait "10" seconds
    And for each host running the service, I query for logs containing the above string on that host
    Then I receive "5" results per host