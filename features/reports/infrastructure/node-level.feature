@cisco
Feature: Node Health

  Scenario: Are all nodes healthy?
  Scenario: Are nodes evenly utilized?
  Scenario: Notifications
  Scenario: If there is a problem, how can I troubleshoot and fix?
  Scenario: How utilized are my nodes?
  Scenario: Is the cluster load evenly distributed?
  Scenario: Are my nodes healthy?
  Scenario: Global dashboard with historical utilization of aggregate node statistics (cpu, memory, disk, n etwork, etc) as well as aggregated filterable/searchable syslogs (default to only showing errors)
  Scenario: Node dashboard with historical utilization of node-specific statistics (cpu, memory, disk, network, etc) as well as logs for that node

  @p1 @metrics @id-2
  Scenario: Node Metrics Dashboard
    * CPU Utilization - Stacked area chart with categories of CPU - nice, system, user.
    * CPU Utilization Per Service - Stacked area chart with services running - RM, HS2, etc
    * Memory Utilization - Stacked area chart with categories of CPU - nice, system, user.
    * Memory Utilization Per Service - Stacked area chart with services running - RM, HS2, etc
    * Swap Rate - Stacked area chart.Network Throughput - Line w/view finder - in, out.
    * MFS Throughput - Line w/view finder - read, write. Aggregate across all instances.
    * MFS IOPS - Line w/view finder - read, write. Aggregate across all instances.
    * MFS Latency - TBD.
    * Network throughput - bps - read,write.
    * Network TCP send queue size.

  @p1 @metrics @id-3
  Scenario: Node Metrics Dashboard (if YARN)
    * YARN Containers - Line w/view finder - numContainers
    * YARN Memory - Line w/view finder - used MemoryMB & top line with used MemoryMB+availMemoryMB.
    * YARN Cores - Line w/view finder - used
    * VirtualCores & top line with used VirtualCores+availableVirtualCores.

  @p1 @logs @id-4
  Scenario: Node Logs Dashboard
     This dashboard should be pre-filtered to only show logs for the node specified, but show both linux syslogs and service logs. Specific services should have checkboxes associated with them giving the ability to further filter in/out specific services.

  @p1
  Scenario: Vague Node Metrics - At a minimum, collect enough node metrics to populate the ‘Node Metrics Dashboard’ requirement. It’s desirable to collect as many additional metrics as are available through the collection framework for users to build custom dashboards from.

  @p1
  Scenario: Node syslog - /var/log/messages, others?

  # From "node" image in the PRD
  Scenario: Node name, ID, IP, Uptime and heartbeat
  Scenario: Alarms and Alerts per node - either "No Alarms" or list with name, metric, and time duration (maybe how long ago it was?)
  Scenario: Graphs of CPU, Memtory, Disk I/O (read vs. write), RPCs (in vs. out) which is right clickable.
  Scenario: Upon right click of RPC we can choose "Set alert" or "zoom..." If we set alert we get popup "send alert if" dropdown with higher vs. lower, than [number] for [time duration] plus [time unit dropdown] with OK button
  Scenario: If they click more under the graphs, they see Network I/O, YARN Containers, Storage Space, DB Get, Put, Scan (do we have reason to believe this list is definitive and exhaustive?)
  Scenario: Table of disks with rows and columns which are not specified
  Scenario: Table of Services with name (ie. Hue), status (up), button for stopping or restarting service, and an arrow that presumably does something (perhaps jump to the service page?)

  #Taken from US6 in PRD
  Scenario: Disk Utilization and Average Wait
    Given there is no hotspotting
    And there is slowness in mapr-db
    When I visit the node dashboards for primary region servers
    Then I can view the disk utilization
    And I can view the average wait (await) which may indicate a bad disk if utilization is also high.


  #Taken from US6 in PRD
  Scenario: MapR DB gets are slow
    Given MapR DB gets are slow
    When I check cache hits/misses on node dashboards of primary region servers
    And I see that misses are high and disk utilization (iostate) is high
    Then I determine that the app is placing too high a load on the DB

  #Taken from US6 in PRD
  Scenario: MapR DB gets are slow
    Given MapR DB gets are slow
    When I look at CPU utilization per core (provided by guts)
    And I see it is maxed out in 1-2 cores
    Then I determine that MFS is bottlenecking CPU (what do I do about this?)

  #Taken from US6 in PRD
  Scenario: MapR DB puts are slow
    Given MapR DB puts are slow
    When I look at rsf (memory reserved for puts - from guts)
    And I see that it is 0
    Then I conclude that the server can't absorb puts at current rate
    And I conclude there is not enough memory for amount of CPU/IO

