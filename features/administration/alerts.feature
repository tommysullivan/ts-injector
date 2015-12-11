Feature: Alerts
  Scenario: Too noisy, need to filter out the noise. Make sure boss doesn't get tons of emails during regular maintenance.
  Scenario: How do I integrate alerts with my existing system, like SNMP traps, IT ticketing, Graphite, etc.
  Scenario: I can add arbitrary hooks for alarms

  @AHG @rubicon @Comscore
  Scenario: I can indicate that I would like to suppress / unsuppress alerts (ie. "Maintenance Mode")
    * may include a timer so they do not forget to turn them back on
    * might be all alerts or perhaps some subset of alerts

  Scenario: If there are multiple redundant alerts I should only send one that summarized it all.

  @p1
  Scenario: We should provide several reference implementations of metric triggers out of the box for Nagios/Icinga, including -
    * Node CPU utilization threshold
    * YARN failed applications threshold
    * Others TBD

  @p3
  Scenario: Log triggers - Users should be able to define a pattern expression that will trigger an alert/alarm.

  # Are alarms and alerts the same thing? I see both words being used throughout documentation and not sure if they mean
  # to differentiate?

  @cisco
  Scenario: Continue to send alarm if not acknowledged

  @cisco
  Scenario: Include criticality in alert

  @rubicon
  Scenario: Need less noise in alarms
    * 20 - 30 alarms at any given time using current solution (up to 1500 per day)
    * Currently raising alarms when nodes are down for maintenance - need "maintenance mode" so that doesn't happen
    * Alarms that happen constantly but require no intervention - 'Volume under Replication'
    * There is a MapR REST API they can poll for alarms - must this still be supported?

  @rubicon @AHG
  Scenario: Alarm hooks
    Before raising an alarm, run a custom script that performs arbitrary handling and either absorbs the alarm or allows it to be raised
    * Disk Failure moves node to /decommissioned, blacklists TT
    * Automated opening of a ticket
    * Have not only pre-processing hooks that decide if alarm should go, but post processing that can take other actions
    * Safety - monitor custom scripts to ensure they don't hang or spend too long

  @rubicon
  Scenario: Suppress redundant alarms (single alarm for node down)

  @rubicon @AHG
  Scenario: Ability to dismiss alarms so they go away and won't continue sending alerts

  @rubicon
  Scenario: Custom alarms in Nagios that monitors graphite metrics - I/O weight exceeding threshold. Should we replace this?

  @AHG
  Scenario: "Watermarks" aka different thresholds for alarms to different people
    * ie. Volume has an owner, so send alert to them at lower threshold, send to general admin at higher threshold
      or if no action is taken
    * Low watermark (send to tenant) medium (tenant and admin) and full (everyone)
    * Need soft limit - route alerts to affected tenants
    * If email alert bounces, raise additional alert to admin
    * Hard limit - no additional details included in PRD on this

  @Comscore
  Scenario: Currently their alerts run on top of MS SQL server

  @Comscore
  Scenario: Ability to silence alerts during off hours

  @Comscore
  Scenario: Ability to send alerts to different emails depending on the time

  @Comscore
  Scenario: Custom subject lines in alert emails for easy filtering