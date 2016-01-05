@draft @questions
Feature: MapR-FS Dashboard

  Scenario: Pre-built third-party logs dashboard that shows overall health/status of MFS. By default, this shows a stacked area chart showing number of log messages over time by severity. In addition, a search bar is shown where users can enter a node name, a CID, FID, or error string to dive deeper.

  @us-7
  Scenario: Administrator has received reports of file system / NFS slowness and wants to troubleshoot
    Given: Admin is in MCS global dashboard
    When they look at IOPS / RPC / Net Throughput / iowait / NetworkTXQueue
    Then they are able to identify any outliers

  @us-7
  Scenario: Block replication problem
    Given log 'writefile <fid> localtime elapsed <time>' messages are seen
    And community forums indicate there is an issue replicating blocks between nodes
    When user goes to node page in MCS to see if problem is due to CPU/memory overutilization
    And sees there is none
    Then they look at network statistics to see if the issue is caused by slow network (TX queue depth)
    And if they don't see that problem either, they click "logs" and inspect syslogs for indications of issue.

  @us-7
  Scenario: Generic MFS Dashboard Log Search
    Given no problems obvious from MCS-assisted FID/CID searches
    When the user visits generic MFS dashboard
    Then they can see all MFS log messages by severity oon the cluster
    And they can take errors from the time when problem occurred and drill down into them
    And they can search for them or work with support

  Scenario: How is overall storage utilization trending over time?
  Scenario: When do more servers need to be added?
  Scenario:
    Given storage utilization has spiked
    When I check which volume(s) contributed most
    Then I get a clear answer
  Scenario: How is my compression ratio trending over time?
  Scenario: Visualizaation of historical storage utilization (separate graphs for pre/post compression) which indication of what volumes contribute most to total size
  Scenario: Per volume historical utilization chart with pre/post compression size
  Scenario: Per-user historical utilization chart
  Scenario: User storage dashboard, same as above dashboard, but admin enters a username and it filters all charts for that user. User in this context is the same as "chargeable entity"
  Scenario: Volume storage dashboard, which only shows data for a single volume.

#  From all storage entities (volume, table, stream) there should be a link labeled ‘Search in Logs...’. When clicked, a page should be opened in the logs viewer that searches for the id of that entity across all node logs.
#  This may require a translation layer. For example, tables will be referenced in MCS logs by their FID, not table name, so a translation is needed. Volumes will also have an ID.

  @p1
  Scenario: Metrics Stroage - Per-volume -
    * Data Size
    * Volume Size
    * Snapshot Size
    * Total Size

  @us-1
  Scenario: Understand storage utilization trends and whether cluster expansion or file deletion is necessary
    Given I am an administrator within MCS
    When I navigate to Storage Utilization Trend dashboard
    Then I can see how closely the total storage utilization is to the top line of cluster capacity

  @us-1
  Scenario: Sudden spike in storage utilization
    Given I am an administrator within MCS
    And I have navigated to Storage Utilization Trend dashboard
    And I have seen a large spike in storage utilization
    And one of the volumes represented in the stacked area chart also grew the same amount
    When I click on the volume name in the chart
    Then I am taken to the volume page where I can see "Accountable Entity"

  @us-7
  Scenario: Read / Write ops are failing
    Given read / write ops are failing
    When admin looks at the volume in MCS
    Then they can check metrics graph to see if quote is being exceeded

  @us-7
  Scenario: Slow read/write from files or directories
    Given there is slow read/write from files or directories
    When the admin goes into MCS
    And clicks Logs to be taken to the log viewer filtered for CIDs associated with the volume
    And unchecks INFO and WARNING messages so that only errors are listed
    Then admin can see if there are errors and if so can look them up in community search

  @cisco
  Scenario: How many disks failed last year?

  @cisco
  Scenario: Storage accounting
    * how do users know how much storage they're actually using (after compression, snapshotting)?