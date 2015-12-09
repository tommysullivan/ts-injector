Feature: Alerts
  Scenario: Too noisy, need to filter out the noise. Make sure boss doesn't get tons of emails during regular maintenance.
  Scenario: How do I integrate alerts with my existing system, like SNMP traps, IT ticketing, Graphite, etc.
  Scenario: I can add arbitrary hooks for alarms
  Scenario: I can indicate that I would like to suppress / unsuppress alerts (ie. "Maintenance Mode")
  Scenario: If there are multiple redundant alerts I should only send one that summarized it all.

  @p1
  Scenario: We should provide several reference implementations of metric triggers out of the box for Nagios/Icinga, including -
    * Node CPU utilization threshold
    * YARN failed applications threshold
    * Others TBD

  @p3
  Scenario: Log triggers - Users should be able to define a pattern expression that will trigger an alert/alarm.