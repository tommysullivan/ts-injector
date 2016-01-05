@draft @questions
Feature: Volumes Table

  # Is there a limit to how many rows show up in the table?
  # Columns are not sortable unless otherwise stated

  Scenario: Columns:
    * Checkbox - Does top row select/deselect all? What happens upon checking? Does select/deselect effect items not in view / loaded?
    * Volume Name - sortable
    * Mount Path
    * Topology
    * Owner
    * Quota
    * Total Size (GB)
    * Snapshots (number)
    * Table Replication (type)
    * Status - "Catch all column for status and exceptions", list any alarms that might have been raised (forever? how much detail?) If status is "mirroring" then show percentage complete (does this auto update?)