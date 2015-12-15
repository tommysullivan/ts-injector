@draft @wip
Feature: Configuration

  # Product Questions:
  # Q: Does retention period effect only the data on disk? Or does it also effect indexed data & reports?
  # Q: What are the ways that configuration can be changed? Where does it reside? How do changes propagate?
  # Q: What is meant by "audit"?
  # Q: What is the difference between "service" and "application" here?
  # Q: How do I differentiate between various services/applications when specifying on/off?
  # Q: Does turning off node log/metrics imply that no service / app / audit logs or metrics are collected? Or just no CPU type metrics?
  # Q: What happens if someone changes the configuration manually? Does it show in the UI?
  # Q: What users are authenticated to use the Dashboards? How is this controlled?

  # Technical Questions:
  # Q: What is the format for specifying longevity?
  # Q: How do the collectors know where to send things?
  # Q: How do the collectors know where to look?
  # Q: Do we collect multi-line logs as a single record?
  # Q: How do we decide what tags should be sent along with a particular record for indexing purposes?
  # Q: How do we express such tagging and is it configurable by the user? In installer?

  @p1 @questions
  Scenario Outline: Toggle Metrics / Logs Collection On / Off at Node or Service Level
    Given I have configured <metrics or logs> collection to be <on or off> for a <type of producer>
    When I view <metrics or logs> for that <type of producer> during the period for which it was <on or off>
    Then I <see or don't see> any <metrics or logs> for that <type of producer>
    And the change takes effect within "30" seconds
    Examples:
      | type of producer | metrics or logs | on or off | see or don't see |
      | node             | metrics         | on        | see              |
      | node             | metrics         | off       | don't see        |
      | node             | logs            | on        | see              |
      | node             | logs            | off       | don't see        |
      | service          | metrics         | on        | see              |
      | service          | metrics         | off       | don't see        |
      | service          | logs            | on        | see              |
      | service          | logs            | off       | don't see        |
      | application      | logs            | off       | don't see        |
      | application      | logs            | on        | see              |
      | audit            | logs            | off       | don't see        |
      | audit            | logs            | on        | see              |

  @p1 @longevity @manual @questions
  Scenario Outline: Rentention Period for Metrics / Logs
    Given I have configured <metrics or logs> retention period to be <period of time> for a <type of producer>
    When sufficient time passes for the retention period to have expired
    Then I see that the <metrics or logs> were deleted from the filesystem and <indexed data location>
    Examples:
      | type of producer | metrics or logs | indexed data location |
      | node             | metrics         | open TSDB             |
      | service          | metrics         | open TSDB             |
      | node             | logs            | elasticsearch         |
      | application      | logs            | elasticsearch         |
      | service          | logs            | elasticsearch         |
      | audit            | logs            | elasticsearch         |

  @p1 @whitebox @questions
  Scenario: Log tagging configuration
    Given I have logging configuration:
    """
    {
      "type": "logConfiguration",
      "logFile": "/path/to/logs",
      "tags": {
        "tagName1": "/regularExpressionForTag1Value/",
        "tagName2": "/regularExpressionForTag2Value/"
      }
    }
    """
    When the following log is written:
    """
    ERROR: some log which may or may not have matches for the tags and
    also may take up multiple lines
    """
    Then the following is sent to elasticsearch:
    """
    {
      "timestamp": 12837627642,
      "tagName1": "value1",
      "tagName2": "value2",
      "logContent": ERROR: some log which may or may not have matches for the tags and \n also may take up multiple lines"
    }
    """

  @questions
  Scenario: Configuration of metric tags